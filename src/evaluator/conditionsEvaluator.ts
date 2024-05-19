import { Condition, DataCondition, Value } from "../model/types";
import { getOperation } from "./operations"
import { ConditionType } from "../model/conditionTypeEnum";


export function evaluateCondition(condition: Condition, variables: { [name: string]: Value }): Value {
    switch (condition.type) {
        case ConditionType.CONSTANT:
            return evaluateConstant(condition.value);
        case ConditionType.VARIABLE:
            return evaluateVariable(condition.name, variables);
        case ConditionType.WALLET:
            return evaluateWallet(condition.symbol);
        case ConditionType.CALL:
            return evaluateCall(condition.name, condition.arguments, variables);
        default:
            throw new Error(`Unsupported condition type`);
    }
}

function evaluateConstant(value: Value): Value {
    return value;
}

function evaluateVariable(name: string, variables: { [name: string]: Value }): Value {
    const value = variables[name];
    if (value === undefined) {
        throw new Error(`Variable '${name}' is not defined.`);
    }
    return value;
}

//TO-DO: Logic to fetch wallet balance for the specified symbol
function evaluateWallet(symbol: string): Value {
    return false;
}

function evaluateCall(name: string, conditions: Condition[] | DataCondition, variables: { [name: string]: Value }): Value {
    if (Array.isArray(conditions)) {
        const args = conditions.map(arg => evaluateCondition(arg, variables));
        const operation = getOperation(name);
        return operation(args);
    } else {
        return handleDataCondition(name, conditions, variables);
    }
}

function handleDataCondition(name: string, condition: DataCondition, variables: { [name: string]: Value }): Value {
    const { symbol, since, until, default: defaultValues } = condition;
  
    const historicalData = getHistoricalData(symbol, since, until);
    const operation = getOperation(name)

    if (historicalData.length === 0 && defaultValues) {
      return operation(defaultValues.map(value => evaluateCondition(value, variables)));
    } else if (historicalData.length === 0) {
      throw new Error('No historical data available and no default value provided.');
    }
  
    return operation(historicalData);
}

function getHistoricalData(symbol: string, since: Number, until: Number): Value[] {
    // Placeholder
    // Maybe this will go in another module
    return [];
}
