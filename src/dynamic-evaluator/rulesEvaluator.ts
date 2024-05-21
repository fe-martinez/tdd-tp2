import { placeOrder } from "../data/binanceApi";
import { Action, BuyMarketAction, SellMarketAction, SetVariableAction } from "../model/types";
import { sendMessage } from "../notifier/notificationSender";
import { ConditionEvaluator } from "./conditionEvaluator";

async function executeAction(action: Action, conditionEvaluator: ConditionEvaluator): Promise<void> {
    switch (action.type) {
        case 'BUY_MARKET':
            console.log(action)
            await executeBuyMarketAction(action as BuyMarketAction, conditionEvaluator);
            break;
        case 'SELL_MARKET':
            console.log(action)
            await executeSellMarketAction(action as SellMarketAction, conditionEvaluator);
            break;
        case 'SET_VARIABLE':
            console.log(action)
            executeSetVariableAction(action as SetVariableAction, conditionEvaluator);
            break;
        default:
            throw new Error(`Unsupported action type: ${action}`);
    }
}

async function executeBuyMarketAction(action: BuyMarketAction, conditionEvaluator: ConditionEvaluator): Promise<void> {
    const amount = conditionEvaluator.compileActionAmount(action)();
    const symbol = action.symbol.replace('/','');
    const buyOrder = await placeOrder(symbol, 'BUY', amount as number);
    sendMessage("Compré " + amount as string + " " + action.symbol + "!")
}

async function executeSellMarketAction(action: SellMarketAction, conditionEvaluator: ConditionEvaluator): Promise<void> {
    const amount = conditionEvaluator.compileActionAmount(action)();
    const symbol = action.symbol.replace('/','');
    const sellOrder = await placeOrder(symbol, 'SELL', amount as number);
    sendMessage("Vendí " + amount as string + " " + action.symbol + "!")
}

function executeSetVariableAction(action: SetVariableAction, conditionEvaluator: ConditionEvaluator): void {
    const value = conditionEvaluator.compileActionValue(action)();
    conditionEvaluator.setVariable(action.name, value);
    console.log(`Setting variable ${action.name} to ${value}`);
}

export async function executeRuleSet(compiledRules: ConditionEvaluator) {
    const rules = compiledRules.ruleMap;
    Object.keys(rules).forEach(ruleName => {
        const rule = rules[ruleName];
        if (rule.condition()) {
            rule.actions.forEach(action => executeAction(action, compiledRules));
        }
    });
}