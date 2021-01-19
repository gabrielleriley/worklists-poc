import { KeyValue } from '@angular/common';
import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { INationalityDTO, IPayload } from '../api-models';

const kvp = (key: string, value: string) => ({ key, value })
const nationalities: KeyValue<string, string>[] = [
    kvp('AU', 'Australia'),
    kvp('BR', 'Brazil'),
    kvp('CA', 'Canada'),
    kvp('CH', 'China'),
    kvp('DE', 'Germany'),
    kvp('DK', 'Denmark'),
    kvp('ES', 'Spain'),
    kvp('FI', 'Finland'),
    kvp('FR', 'France'),
    kvp('GB', 'United Kingdom'),
    kvp('IE', 'Ireland'),
    kvp('IR', 'Iran'),
    kvp('NO', 'Norway'),
    kvp('NL', 'Netherlands'),
    kvp('NZ', 'New Zealand'),
    kvp('TR', 'Turkey'),
    kvp('US', 'United States')
];

/**
 * HTTP service modeled after non-paginated data sets, which are often used to populate select filters in worklists (ex: users, practices)
 */
@Injectable()
export class NationalitiesHttpService {
    public getNationalities(): Observable<IPayload<INationalityDTO[]>> {
        return of(nationalities).pipe(
            delay((Math.random() * 500) + 1500),
            map((nats) => ({
                data: nats.map((n) => ({ code: n.key, name: n.value }))
            }))
        )
    }
}