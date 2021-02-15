import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface IUserPreference {
    someData: number[];
    otherData: number;
    anotherData: string;
}

/**
 * This service is just a mock for the POC. Filter preferences will usually be stored via an API.
 */
@Injectable({ providedIn: 'root' })
export class UserPreferenceService { 
    private readonly key = 'user-filter-preference';

    public getPreference(): Observable<IUserPreference> {
        const p = sessionStorage.getItem(this.key);
        return of(p ? JSON.parse(p) : undefined).pipe(
            delay(1500)
        );
    }

    public setPreference(preference: IUserPreference) {
        sessionStorage.setItem(this.key, JSON.stringify(preference));
    }
}
