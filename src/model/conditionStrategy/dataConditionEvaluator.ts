import { getHistoricalPairValues } from "../../data/database";
import { getOperation } from "../../operations/operations";
import { ConditionEvaluator, ConditionEvaluatorType, ConditionEvaluatorVariables } from "./conditionEvaluator";
import ConditionEvaluatorFactory from "./conditionEvaluatorFactory";

export default class DataConditionEvaluator implements ConditionEvaluator {
    private symbol: string;
    private from: number;
    private until: number;
    private defaults: ConditionEvaluator[];
    private operation: Function;
    constructor(symbol: string, from: number, until: number, defaults: ConditionEvaluator[], functionName: string) {
        this.symbol = symbol;
        this.from = from;
        this.until = until;
        this.defaults = defaults
        this.operation = getOperation(functionName);
    }

    static fromJson(json: any, functionName: string) {
        if (!json.hasOwnProperty("symbol"))
            throw new Error("Data condition evaluator must have a symbol");
        if (typeof json.symbol !== 'string')
            throw new Error("Data condition evaluator symbol must be a string");
        if (!json.hasOwnProperty("from"))
            throw new Error("Data condition evaluator must have a from");
        if (typeof json.from !== 'number')
            throw new Error("Data condition evaluator from must be a number");
        if (!json.hasOwnProperty("until"))
            throw new Error("Data condition evaluator must have a until");
        if (typeof json.until !== 'number')
            throw new Error("Data condition evaluator until must be a number");

        const defaults = json.hasOwnProperty("default") ? json.default.map((def: any) => new ConditionEvaluatorFactory(def).create()) : [];
        return new DataConditionEvaluator(json.symbol, json.from, json.until, defaults, functionName);
    }

    async evaluate(variables: ConditionEvaluatorVariables): Promise<ConditionEvaluatorType> {
        var data = getHistoricalPairValues(this.symbol, this.from, this.until);
        if (data.length === 0) {
            const defaultData = await Promise.all(this.defaults.map(def => def.evaluate(variables)));
            return this.operation(defaultData);
        }
        return this.operation(data);
    }
}