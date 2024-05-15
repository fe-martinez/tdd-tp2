import { getOperation } from './operations';

describe('getOperation', () => {
    it('should perform equal (==) operation correctly', () => {
        const operation = getOperation('==');
        expect(operation([1, 1, 1])).toBe(true);
        expect(operation([1, 2, 3])).toBe(false);
    });

    it('should perform the DISTINCT operation correctly', () => {
        const operation = getOperation('DISTINCT');
        expect(operation([1, 1, 1])).toBe(false);
        expect(operation([1, 2, 3])).toBe(true);
    });

    it('should perform the sum (+) operation correctly', () => {
        const operation = getOperation('+');
        expect(operation([1, 2, 3])).toBe(6);
        expect(operation([4, 5, 6])).toBe(15);
        expect(operation([-1, 0, 1])).toBe(0);
    });

    it('should throw an error for undefined operation', () => {
        const operation = getOperation('undefined');
        expect(() => operation([1, 2, 3])).toThrow();
    });
});