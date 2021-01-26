import { combineLatest, Observable } from 'rxjs';
import { mapTo, shareReplay, startWith, tap } from 'rxjs/operators';
import { containsValuePipe } from '../pipes';

export const somethingIsPreloading = (isLoaded: Observable<boolean>[]) => combineLatest(
    ...isLoaded
).pipe(
    containsValuePipe(false),
    startWith(true)
);

export const hasSetPreference = <PreferenceModel>(
    fetch: () => Observable<PreferenceModel>,
    set: (preference: PreferenceModel) => void) => fetch().pipe(
        tap((p) => set(p)),
        mapTo(true),
        startWith(false),
        shareReplay(),
    );