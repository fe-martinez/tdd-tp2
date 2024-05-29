import DataConditionEvaluator from "./dataConditionEvaluator";
import { getHistoricalPairValues } from "../../data/database";

jest.mock("../../data/database", () => ({
    getHistoricalPairValues: jest.fn()
}));


describe('DataConditionEvaluator', () => {
    it('should throw error if json has not "symbol" property', () => {
        expect(() => DataConditionEvaluator.fromJson({}, "==")).toThrow(Error);
    });

    it('should throw error if json "symbol" property is not string', () => {
        expect(() => DataConditionEvaluator.fromJson({ symbol: 1 }, "==")).toThrow(Error);
    });

    it('should throw error if json has not "from" property', () => {
        expect(() => DataConditionEvaluator.fromJson({ symbol: "BTCUSDT" }, "==")).toThrow(Error);
    });

    it('should throw error if json "from" property is not number', () => {
        expect(() => DataConditionEvaluator.fromJson({ symbol: "BTCUSDT", from: "1" }, "==")).toThrow(Error);
    });

    it('should throw error if json has not "until" property', () => {
        expect(() => DataConditionEvaluator.fromJson({ symbol: "BTCUSDT", from: 1 }, "==")).toThrow(Error);
    });

    it('should throw error if json "until" property is not number', () => {
        expect(() => DataConditionEvaluator.fromJson({ symbol: "BTCUSDT", from: 1, until: "1" }, "==")).toThrow(Error);
    });

    it('should throw error if json has not "default" property', () => {
        expect(() => DataConditionEvaluator.fromJson({ symbol: "BTCUSDT", from: 1, until: 1 }, "==")).toThrow(Error);
    });

    it('should throw error if json "default" property is not array', () => {
        expect(() => DataConditionEvaluator.fromJson({ symbol: "BTCUSDT", from: 1, until: 1, default: 1 }, "==")).toThrow(Error);
    });

    it('should create a data condition evaluator from json', () => {
        const json = {
            symbol: "BTCUSDT",
            from: 4,
            until: 2,
            default: []
        };
        const evaluator = DataConditionEvaluator.fromJson(json, "==");
        expect(evaluator).toBeInstanceOf(DataConditionEvaluator);
    });

    it('should return a correct value when evaluating', async () => {
        const json = {
            symbol: "BTCUSDT",
            from: 4,
            until: 2,
            default: []
        };

        (getHistoricalPairValues as jest.Mock).mockReturnValueOnce([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        const evaluator = DataConditionEvaluator.fromJson(json, "+");
        expect(await evaluator.evaluate(new Map())).toBe(45);
    });

    it('should return a correct value when evaluating with defaults', async () => {
        const json = {
            symbol: "TDDUSDT",
            from: 4,
            until: 2,
            default: [{
                type: "CONSTANT",
                value: 2000
            },{
                type: "CONSTANT",
                value: 2001
            }]
            
        };

        (getHistoricalPairValues as jest.Mock).mockReturnValueOnce([]);
        const evaluator = DataConditionEvaluator.fromJson(json, "+");
        expect(await evaluator.evaluate(new Map())).toBe(4001);
    });
    

    it('should evaluate data correctly in different scenarios without rebuiliding the object', async () => {
        const json = {
            symbol: "BTCUSDT",
            from: 4,
            until: 2,
            default: [{
                type: "CONSTANT",
                value: 2000
            },{
                type: "CONSTANT",
                value: 2001
            }]
        };

        const evaluator = DataConditionEvaluator.fromJson(json, "+");
        (getHistoricalPairValues as jest.Mock).mockReturnValueOnce([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        expect(await evaluator.evaluate(new Map())).toBe(45);
        (getHistoricalPairValues as jest.Mock).mockReturnValueOnce([10, 20, 30, 40, 50, 60, 70, 80, 90]);
        expect(await evaluator.evaluate(new Map())).toBe(450);
    });

});