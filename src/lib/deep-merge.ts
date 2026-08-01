// lib/deep-merge.ts
type PlainObject = Record<string, unknown>;

export type DeepPartial<T> = T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

function isPlainObject(value: unknown): value is PlainObject {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function deepMerge<T extends PlainObject>(defaults: T, overrides: DeepPartial<T>): T {
    const result: PlainObject = { ...defaults };

    for (const key in overrides) {
        const overrideValue = overrides[key];
        const defaultValue = defaults[key];

        if (isPlainObject(overrideValue) && isPlainObject(defaultValue)) {
            result[key] = deepMerge(defaultValue as PlainObject, overrideValue as PlainObject);
        } else if (overrideValue !== undefined) {
            result[key] = overrideValue;
        }
    }

    return result as T;
}