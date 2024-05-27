import { ConditionEvaluator, ConditionEvaluatorType, ConditionEvaluatorVariables } from "./conditionEvaluator";

export default class DataConditionEvaluator implements ConditionEvaluator {
    private symbol: string;
    private from: number;
    private until: number;
    private defaults: ConditionEvaluator[];
    constructor(symbol: string, from: number, until: number, defaults: ConditionEvaluator[]) {
        this.symbol = symbol;
        this.from = from;
        this.until = until;
        this.defaults = defaults;
    }

    static fromJson(json: any) {
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
        if (!json.hasOwnProperty("defaults"))
            throw new Error("Data condition evaluator must have a defaults");
        if (!Array.isArray(json.defaults))
            throw new Error("Data condition evaluator defaults must be an array");

        return new DataConditionEvaluator(json.symbol, json.from, json.until, json.defaults);
    }

    async evaluate(variables: ConditionEvaluatorVariables): Promise<ConditionEvaluatorType> {
        return Promise.resolve(0);
    }
}