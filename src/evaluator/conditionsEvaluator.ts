import { Condition, DataCondition, Value } from "../model/types";
import { getOperation } from "./operations"
import { ConditionType } from "../model/conditionTypeEnum";
import { getHistoricalPairValues } from "../data/database";


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

function evaluateCall(name: string, conditions: Condition[], variables: { [name: string]: Value }): Value {
    const args = conditions.map(arg => {
        if (arg.type === ConditionType.DATA) {
            return handleDataCondition(name, arg, variables);
        } else {
            return evaluateCondition(arg, variables);
        }
    });
    const operation = getOperation(name);
    return operation(args);
}

function handleDataCondition(name: string, condition: DataCondition, variables: { [name: string]: Value }): Value {
    // Parse the symbol to get the / out
    let symbol = condition.symbol.replace('/', '');
    const historicalData = getHistoricalData(symbol, condition.since, condition.until);
    const operation = getOperation(name)

    if (historicalData.length === 0 && condition.default) {
      return operation(condition.default.map(value => evaluateCondition(value, variables)));
    } else if (historicalData.length === 0) {
      throw new Error(`No historical data available for pair ${symbol} and no default value provided.`);
    }
  
    return operation(historicalData);
}

function getHistoricalData(symbol: string, since: number, until: number): Value[] {
    return getHistoricalPairValues(symbol, since, until);
}
