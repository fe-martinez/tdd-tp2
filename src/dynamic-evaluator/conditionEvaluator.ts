import { Action, BuyMarketAction, Condition, DataCondition, RuleSet, SellMarketAction, SetVariableAction, Value } from "../evaluator/types";
import { ConditionType } from "../evaluator/conditionTypeEnum";
import { getOperation } from "../evaluator/operations";

export class ConditionEvaluator {
    private compiledConditions: { [name: string]: Function } = {};
    private variables: { [name: string]: Value };
    public ruleMap: { [ruleName: string]: { condition: Function, actions: Action[] } } = {};

    constructor(private ruleSet: RuleSet) {
        this.variables = { ...ruleSet.variables }
        this.compileRuleSet(ruleSet);
    }

    private compileRuleSet(ruleSet: RuleSet) {
        ruleSet.rules.forEach(rule => {
            const compiledCondition = this.compileCondition(rule.condition);
            this.compiledConditions[rule.name] = compiledCondition;
            this.ruleMap[rule.name] = { condition: compiledCondition, actions: rule.action }; // Add this line
        })
    }

    private compileCondition(condition: Condition): Function {
        switch (condition.type) {
            case ConditionType.CONSTANT:
                return () => condition.value;
            case ConditionType.VARIABLE:
                return () => {
                    const value = this.variables[condition.name];
                    if (value === undefined) {
                        throw new Error(`Variable '${condition.name}' is not defined.`);
                    }
                    return value;
                };
            case ConditionType.WALLET:
                return () => this.evaluateWallet(condition.symbol);
            case ConditionType.CALL:
                const args = Array.isArray(condition.arguments) ? condition.arguments : [condition.arguments];
                const compiledArgs = args.map(arg => this.compileCondition(arg));
                const operation = getOperation(condition.name);
                return () => {
                    const args = compiledArgs.map(fn => fn());
                    return operation(args);
                }
            case ConditionType.DATA:
                return () => this.evaluateDataCondition(condition);
            default:
                throw new Error(`Unsupported condition type: ${condition}`);
        }
    }

    private evaluateDataCondition(condition: DataCondition): Value[] {
        const { symbol, since, until, default: defaultValues } = condition;
        const historicalData = this.getHistoricalData(symbol, since, until);
        if (historicalData.length === 0 && defaultValues) {
            return defaultValues.map(value => this.compileCondition(value)());
        } else if (historicalData.length === 0) {
            throw new Error('No historical data available and no default value provided.');
        }
        return historicalData;
    }

    private evaluateWallet(symbol: string): Value {
        return 0;
    }

    private getHistoricalData(symbol: string, since: number, until: number): Value[] {
        return [80000];
    }

    public evaluateCondition(conditionName: string): Value {
        const compiledCondition = this.compiledConditions[conditionName];
        if (!compiledCondition) {
            throw new Error(`Condition '${conditionName}' is not present in the RuleSet.`);
        }
        return compiledCondition();
    }

    public returnAllRuleNames(): string[] {
        return Object.keys(this.compiledConditions);
    }

    public compileActionAmount(action: BuyMarketAction | SellMarketAction): Function {
        return this.compileCondition(action.amount);
    }

    public compileActionValue(action: SetVariableAction): Function {
        return this.compileCondition(action.value);
    }

    public setVariable(name: string, value: Value): void {
        this.variables[name] = value;
    }

}