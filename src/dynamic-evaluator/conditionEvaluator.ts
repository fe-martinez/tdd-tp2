import { Action, BuyMarketAction, CallCondition, Condition, ConstantCondition, DataCondition, RuleSet, SellMarketAction, SetVariableAction, Value, VariableCondition } from "../model/types";
import { ConditionType } from "../model/conditionTypeEnum";
import { getOperation } from "../evaluator/operations";
import { getHistoricalPairValues } from "../data/database";

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
            this.ruleMap[rule.name] = { condition: compiledCondition, actions: rule.action };
        })
    }

    private compileCondition(condition: Condition): Function {
        switch (condition.type) {
            case ConditionType.CONSTANT:
                return this.compileConstantCondition(condition);
            case ConditionType.VARIABLE:
                return this.compileVariableCondition(condition);
            case ConditionType.WALLET:
                return this.evaluateWallet(condition.symbol);
            case ConditionType.CALL:
                return this.compileCallCondition(condition);
            case ConditionType.DATA:
                return this.evaluateDataCondition(condition);
            default:
                throw new Error(`Unsupported condition type: ${condition}`);
        }
    }

    private compileConstantCondition(condition: ConstantCondition): Function {
        return () => condition.value;
    }
    
    private compileVariableCondition(condition: VariableCondition): Function {
        return () => {
            const value = this.variables[condition.name];
            if (value === undefined) {
                throw new Error(`Variable '${condition.name}' is not defined.`);
            }
            return value;
        }
    }

    private evaluateWallet(symbol: string): Function {
        return () => 0;
    }
    

    private compileCallCondition(condition: CallCondition): Function {
        const args = Array.isArray(condition.arguments) ? condition.arguments : [condition.arguments];
        const compiledArgs = args.map(arg => this.compileCondition(arg));
        const operation = getOperation(condition.name);
        return () => {
            const args = compiledArgs.map(fn => fn());
            console.log(args);
            console.log(operation)
            return operation(args);
        }
    }

    private evaluateDataCondition(condition: DataCondition): Function {
        return () => {
            const historicalData = this.getHistoricalData(condition.symbol, condition.since, condition.until);
            if (historicalData.length === 0 && condition.default) {
                return condition.default.map(value => this.compileCondition(value)());
            } else if (historicalData.length === 0) {
                throw new Error('No historical data available and no default value provided.');
            }
            return historicalData;
        }
    }

    private getHistoricalData(symbol: string, since: number, until: number): Value[] {
        return getHistoricalPairValues(symbol, since, until);
    }

    public evaluateCondition(ruleName: string): boolean {
        const rule = this.ruleMap[ruleName];
        if (!rule) {
            throw new Error(`Rule '${ruleName}' is not defined.`);
        }
        return rule.condition();
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

    public getVariable(name: string): Value {
        return this.variables[name];
    }

}