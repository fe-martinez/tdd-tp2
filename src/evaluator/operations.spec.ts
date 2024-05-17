import { getOperation } from './operations';

describe('getOperation', () => {
    it('should perform equal (==) operation correctly', () => {
        const operation = getOperation('==');
        expect(operation([1, 1, 1])).toBe(true);
        expect(operation([1, 2, 3])).toBe(false);
        expect(operation([1])).toBe(true);
    });

    it('should perform the DISTINCT operation correctly', () => {
        const operation = getOperation('DISTINCT');
        expect(operation([1, 1, 1])).toBe(false);
        expect(operation([1, 2, 3])).toBe(true);
        expect(operation([1])).toBe(true);
    });

    it('should perform the sum (+) operation correctly', () => {
        const operation = getOperation('+');
        expect(operation([1, 2, 3])).toBe(6);
        expect(operation([4, 5, 6])).toBe(15);
        expect(operation([-1, 0, 1])).toBe(0);
        expect(operation([1])).toBe(1);
    });

    it('should throw an error for undefined operation', () => {
        const operation = getOperation('undefined');
        expect(() => operation([1, 2, 3])).toThrow();
    });
    it('should perform the greater than (>) operation correctly', () => {
        const operation = getOperation('>');
        expect(operation([1, 2, 3])).toBe(true);
        expect(operation([3, 2, 1])).toBe(false);
        expect(operation([1, 2, 1])).toBe(false);
        expect(operation([1, 1, 1])).toBe(false);
    })
    it('should perform the less than (<) operation correctly', () => {      
        const operation = getOperation('<');
        expect(operation([1, 2, 3])).toBe(false);
        expect(operation([3, 2, 1])).toBe(true);
        expect(operation([1, 2, 1])).toBe(false);
        expect(operation([1, 1, 1])).toBe(false);
    })
    it('should perform the greater or equal than (>=) operation correctly', () => {
        const operation = getOperation('>=');
        expect(operation([1, 2, 3])).toBe(true);
        expect(operation([3, 2, 1])).toBe(false);
        expect(operation([1, 2, 1])).toBe(false);
        expect(operation([1, 1, 1])).toBe(true);
    })
    it('should perform the less or equal than (<=) operation correctly', () => {
        const operation = getOperation('<=');
        expect(operation([1, 2, 3])).toBe(false);
        expect(operation([3, 2, 1])).toBe(true);
        expect(operation([1, 2, 1])).toBe(false);
        expect(operation([1, 1, 1])).toBe(true);
    })
    it('should perform the negate operation correctly', () => {
        const operation = getOperation('NEGATE');
        expect(operation([1])).toBe(-1);
        expect(operation([2])).toBe(-2);
        expect(operation([-2])).toBe(2);
        expect(operation([-2, 1])).toBe(NaN);
    })
    it('should perform the subtract operation correctly', () => {
        const operation = getOperation('-');
        expect(operation([1, 2])).toBe(-1);
        expect(() => operation([4, 1, 2])).toThrow();
        expect(() => operation([])).toThrow();
        expect(() => operation([1])).toThrow();
    })
});