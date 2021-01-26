import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface I<%= classify(name) %>Preference {
    someData: number[];
    otherData: number;
    anotherData: string;
}

/**
 * This service is just a mock for the POC. Filter preferences will usually be stored via an API.
 */
@Injectable({ providedIn: 'root' })
export class <%= classify(name) %>PreferenceService { 
    private readonly key = '<%= dasherize(name) %>-filter-preference';

    public getPreference(): Observable<I<%= classify(name) %>Preference> {
        const p = sessionStorage.getItem(this.key);
        return of(p ? JSON.parse(p) : undefined).pipe(
            delay(1500)
        );
    }

    public setPreference(preference: I<%= classify(name) %>Preference) {
        sessionStorage.setItem(this.key, JSON.stringify(preference));
    }
}
