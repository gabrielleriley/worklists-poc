import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface IPersonFilterPreference {
    lastName?: string;
    genders: string[];
    nationalityCodes: string[];
}

@Injectable({ providedIn: 'root' })
export class PersonFilterPreferenceMockService {
    private readonly key = 'person-filter-preference';
    public getPreference(): Observable<IPersonFilterPreference> {
        const p = sessionStorage.getItem(this.key);
        return of(p ? JSON.parse(p) : undefined).pipe(
            delay(1500)
        );
    }

    public setPreference(preference: IPersonFilterPreference) {
        sessionStorage.setItem(this.key, JSON.stringify(preference));
    }
}