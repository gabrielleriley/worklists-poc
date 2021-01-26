import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

type Primitive = number | string | boolean | undefined | null;

export const containsValuePipe = <T extends Primitive>(value: T) => pipe(
    map((arr: Primitive[]) => arr.some((i) => i === value))
);

export const onlyContainsValue = <T extends Primitive>(value: T) => pipe(
    map((arr: Primitive[]) => arr.every((i) => i === value))
);
