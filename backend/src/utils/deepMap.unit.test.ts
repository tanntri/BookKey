import { deepMap } from './deepMap'; // replace with your actual file path

describe('deepMap', () => {
    it('replaces all string values with uppercase', () => {
        const input = {
            name: 'alice',
            info: {
                city: 'london',
                age: 30
            },
            hobbies: ['reading', 'music']
        };

        const result = deepMap(input, ({ value }) => {
            if (typeof value === 'string') {
                return value.toUpperCase();
            }
            return value;
        });

        expect(result).toEqual({
            name: 'ALICE',
            info: {
                city: 'LONDON',
                age: 30
            },
            hobbies: ['READING', 'MUSIC']
        });
    });

    it('handles circular references', () => {
        const obj: any = { name: 'bob' };
        obj.self = obj;

        const result = deepMap(obj, ({ value }) => value);

        expect(result).toEqual({
            name: 'bob',
            self: 'circular!'
        });
    });

    it('provides correct path to replaceFn', () => {
        const spy = jest.fn(({ value }) => value);

        const input = {
            user: {
                profile: {
                    age: 25
                }
            }
        };

        deepMap(input, spy);

        expect(spy).toHaveBeenCalledWith({
            path: 'user.profile.age',
            key: 'age',
            value: 25
        });
    });
});
