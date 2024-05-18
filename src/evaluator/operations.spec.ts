import { getOperation } from './operations';

describe('getOperation', () => {
    it('should perform equal (==) operation correctly', () => {
        const operation = getOperation('==');
        expect(operation([1, 1, 1])).toBe(true);
        expect(operation([1, 2, 3])).toBe(false);
        expect(operation([1])).toBe(true);
        expect(() => operation([])).toThrow();
    });

    it('should perform the DISTINCT operation correctly', () => {
        const operation = getOperation('DISTINCT');
        expect(operation([1, 1, 1])).toBe(false);
        expect(operation([1, 2, 3])).toBe(true);
        expect(operation([1])).toBe(true);
        expect(() => operation([])).toThrow();
    });

    it('should perform the sum (+) operation correctly', () => {
        const operation = getOperation('+');
        expect(operation([1, 2, 3])).toBe(6);
        expect(operation([4, 5, 6])).toBe(15);
        expect(operation([-1, 0, 1])).toBe(0);
        expect(operation([1])).toBe(1);
        expect(() => operation([])).toThrow();
    });
    it('should perform the greater than (>) operation correctly', () => {
        const operation = getOperation('>');
        expect(operation([1, 2, 3])).toBe(true);
        expect(operation([3, 2, 1])).toBe(false);
        expect(operation([1, 2, 1])).toBe(false);
        expect(operation([1, 1, 1])).toBe(false);
        expect(operation([1])).toBe(true);
        expect(() => operation([])).toThrow();
    })
    it('should perform the less than (<) operation correctly', () => {      
        const operation = getOperation('<');
        expect(operation([1, 2, 3])).toBe(false);
        expect(operation([3, 2, 1])).toBe(true);
        expect(operation([1, 2, 1])).toBe(false);
        expect(operation([1, 1, 1])).toBe(false);
        expect(operation([1])).toBe(true);
        expect(() => operation([])).toThrow();
    })
    it('should perform the greater or equal than (>=) operation correctly', () => {
        const operation = getOperation('>=');
        expect(operation([1, 2, 3])).toBe(true);
        expect(operation([3, 2, 1])).toBe(false);
        expect(operation([1, 2, 1])).toBe(false);
        expect(operation([1, 1, 1])).toBe(true);
        expect(operation([1])).toBe(true);
        expect(() => operation([])).toThrow();
    })
    it('should perform the less or equal than (<=) operation correctly', () => {
        const operation = getOperation('<=');
        expect(operation([1, 2, 3])).toBe(false);
        expect(operation([3, 2, 1])).toBe(true);
        expect(operation([1, 2, 1])).toBe(false);
        expect(operation([1, 1, 1])).toBe(true);
        expect(operation([1])).toBe(true);
        expect(() => operation([])).toThrow();
    })
    it('should perform the negate operation correctly', () => {
        const operation = getOperation('NEGATE');
        expect(operation([1])).toBe(-1);
        expect(operation([2])).toBe(-2);
        expect(operation([-2])).toBe(2);
        expect(operation([-2, 1])).toBe(NaN);
        expect(operation([])).toBe(NaN);
    })
    it('should perform the subtract operation correctly', () => {
        const operation = getOperation('-');
        expect(operation([1, 2])).toBe(-1);
        expect(() => operation([4, 1, 2])).toThrow();
        expect(() => operation([])).toThrow();
        expect(() => operation([1])).toThrow();
    })
    it('should perform the divide operation correctly', () => {
        const operation = getOperation('/');
        expect(operation([1, 2])).toBe(0.5);
        expect(() => operation([4, 1, 2])).toThrow();
        expect(() => operation([])).toThrow();
        expect(() => operation([1])).toThrow();
    })
    it('should perform the multiply operation correctly', () => {
        const operation = getOperation('*');
        expect(operation([1, 2])).toBe(2);
        expect(operation([4, 1, 2])).toBe(8);
        expect(operation([8])).toBe(8);
        expect(() => operation([])).toThrow();
    })
    it('should perform the min operation correctly', () => {
        const operation = getOperation('MIN');
        expect(operation([1, 2])).toBe(1);
        expect(operation([4, 5, 2])).toBe(2);
        expect(operation([8])).toBe(8);
        expect(() => operation([])).toThrow();
    })
    it('should perform the max operation correctly', () => {
        const operation = getOperation('MAX');
        expect(operation([8])).toBe(8);
        expect(operation([1, 2])).toBe(2);
        expect(operation([4, 5, 2])).toBe(5);
        expect(() => operation([])).toThrow();
    })
    it('should return the first element of the array', () => { 
        const operation = getOperation('FIRST');
        expect(operation([0])).toBe(0);
        expect(operation([1, 2, 3])).toBe(1);
        expect(() => operation([])).toThrow();
    })
    it('should return the last element of the array', () => {
        const operation = getOperation('LAST');
        expect(operation([0])).toBe(0);
        expect(operation([1, 2, 3])).toBe(3);
        expect(() => operation([])).toThrow();
    })
    it('should perform the not operation correctly', () => {
        const operation = getOperation('NOT');
        expect(operation([true])).toBe(false);
        expect(operation([false])).toBe(true);
        expect(() => operation([])).toThrow();
        expect(() => operation([false, true])).toThrow();        
    })
    it('should perform the and operation correctly', () => {
        const operation = getOperation('AND');
        expect(operation([true, true])).toBe(true);
        expect(operation([true, false])).toBe(false);
        expect(operation([false, true])).toBe(false);
        expect(operation([false, false])).toBe(false);
        expect(operation([true, true, true])).toBe(true);
        expect(operation([true, true, false])).toBe(false);
        expect(operation([true])).toBe(true);
        expect(() => operation([])).toThrow();        
    })
    it('should perform the or operation correctly', () => {
        const operation = getOperation('OR');
        expect(() => operation([])).toThrow();
        expect(operation([false, false])).toBe(false);
        expect(operation([false, false, false])).toBe(false);
        expect(operation([false])).toBe(false);
        expect(operation([true, false])).toBe(true);
    })
    it('should throw an error for undefined operation', () => {
        const operation = getOperation('undefined');
        expect(() => operation([1, 2, 3])).toThrow();
    });
});