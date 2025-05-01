type Value = object | number | string | boolean | null | undefined | Function | Symbol | any[];
type ReplaceFn = ({ path, key, value }: { path: string; key: string; value: Value }) => Value;

function isObject(value: any): value is object {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

function buildPath(pathArray: string[]): string {
  return pathArray.join('.');
}

function deepMapInternal(
    input: Value,
    replaceFn: ReplaceFn,
    seen: WeakSet<object>,
    pathArray: string[],
    parentKey: string
    ): Value {
    // Base case: skip if we’ve already seen this object (circular ref)
    if ((typeof input === 'object' || typeof input === 'function' || typeof input === 'symbol') && input !== null) {
        if (seen.has(input)) {
            return 'circular!';
        }
        seen.add(input);
    }
    
    // Build the current path string like "user.name"
    const path = buildPath([...pathArray, parentKey].filter(Boolean));

    // Call custom replace function
    const result = replaceFn({ path, key: parentKey, value: input });
  
    // If null/undefined/false is returned, stop
    if (!result) return result;
  
    // If result is an array, go through each item and continue recursion
    if (isArray(result)) {
        return result.map((item, index) =>
            deepMapInternal(item, replaceFn, seen, [...pathArray, parentKey], String(index))
        );
    }

    // If result is an object, go through each key and recurses into the value
    if (isObject(result)) {
      const output: Record<string, any> = {};
        for (const [key, value] of Object.entries(result)) {
            output[key] = deepMapInternal(value, replaceFn, seen, [...pathArray, parentKey], key);
        }
        return output;
    }
  
    return result;
}
  

export function deepMap<T = Value>(input: Value, replaceFn: ReplaceFn): T {
  const seen = new WeakSet<object>();
  const mapped = deepMapInternal(input, replaceFn, seen, [], '');
  return structuredClone(mapped) as T;
}
