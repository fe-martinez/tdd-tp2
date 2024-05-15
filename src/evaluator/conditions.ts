import { Condition, DataCondition, Value } from "./types";
import { getOperation } from "./operations"


export function evaluateCondition(condition: Condition, variables: { [name: string]: Value }): Value {
    switch (condition.type) {
        case 'CONSTANT':
            return evaluateConstant(condition.value);
        case 'VARIABLE':
            return evaluateVariable(condition.name, variables);
        case 'WALLET':
            return evaluateWallet(condition.symbol);
        case 'CALL':
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

function evaluateWallet(symbol: string): Value {
    // Logic to fetch wallet balance for the specified symbol
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
