import lodashPick from "lodash/pick";

// in case of using lodash's pick with non-existence key, show error
export const pick = <TObject extends Object, TKeys extends keyof TObject>(
    obj: TObject,
    keys: TKeys[]
): Pick<TObject, TKeys> => {
    return lodashPick(obj, keys);
}