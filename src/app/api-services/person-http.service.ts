import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, first, map, switchMap, tap } from 'rxjs/operators';
import { IPayload, IPersonDTO, IPersonResultsDTO, IPersonRequestDTO, PersonSortColumnDTO } from '../api-models';

/**
 * HTTP service is modeled after paginated API controllers in P+ (i.e: worklist features)
 */
@Injectable()
export class PersonHttpService {
    constructor(private http: HttpClient) { }

    private readonly route = 'https://randomuser.me/api/';

    // Sample API doesn't support filtering and sorting, so just saving a big list of people to filter client-side
    private db = new BehaviorSubject<IPersonDTO[]>([]);

    public search(page: number, size: number, request: IPersonRequestDTO): Observable<IPayload<IPersonDTO[]>> {
        return this.getList().pipe(
            map((people: IPersonDTO[]) => ({
                data: this.filterSortPeople(request, people)
                    .slice(
                        page * size,
                        page * size + size
                    )
            })),
        );
    }

    public count(request: IPersonRequestDTO): Observable<number> {
        return this.getList().pipe(
            map((people: IPersonDTO[]) => this.filterSortPeople(request, people).length)
        );
    }

    public deleteById(id: string): Observable<void> {
        return this.db.pipe(
            first(),
            tap((people: IPersonDTO[]) => {
                this.db.next(people.filter((p) => p.login.uuid !== id))
            }),
            delay(2000),
            map(() => undefined)
        );
    }

    private generatePersonDatabase() {
        const params = new HttpParams()
            .append('exl', 'picture,registered')
            .append('results', '1000');
        return this.http.get<IPersonResultsDTO>(this.route, { params }).pipe(
            tap((res) => this.db.next(res.results))
        );
    }

    private filterSortPeople(request: IPersonRequestDTO, people: IPersonDTO[]): IPersonDTO[] {
        const getSortProp = (person: IPersonDTO, sortCol: PersonSortColumnDTO): string => {
            switch(sortCol) {
                case PersonSortColumnDTO.Email:
                    return person.email;
                case PersonSortColumnDTO.FirstName:
                    return person.name.first;
                case PersonSortColumnDTO.LastName:
                    return person.name.last;
            }
        }
        return people
            .filter(p => (request?.genders ?? []).length === 0 || request?.genders?.some((g) => g === p.gender))
            .filter(p => (request?.nationalities ?? []).length === 0 || request?.nationalities?.some((nat) => p.nat === nat))
            .filter(p => p.name.last.toUpperCase().startsWith((request?.lastName ?? '').toUpperCase()))
            .sort((p1, p2) => {
                if (request?.sortColumn && (request.order == 'asc' || request.order == 'desc')) {
                    const p1Prop = getSortProp(p1, request.sortColumn);
                    const p2Prop = getSortProp(p2, request.sortColumn);
                    return request.order === 'asc' ?
                        (p1Prop > p2Prop ? 1 : -1)
                        : (p1Prop > p2Prop ? -1 : 1)
                } else {
                    return 0;
                }
            });
    }

    private getList() {
        return this.db.pipe(
            switchMap((db) => db.length > 0
                ? this.db.pipe(delay((Math.random() * 500)))
                : this.generatePersonDatabase()
            ),
            first(),
        );
    }
}