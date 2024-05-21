import { evaluateCondition } from "./conditionsEvaluator";
import { Action, RuleSet, Value } from "../model/types";
import { placeOrder } from "../data/binanceApi";
import { sendMessage } from "../notifier/notificationSender";

export function evaluateRules(ruleSet: RuleSet) {
  for (const rule of ruleSet.rules) {
    if (evaluateCondition(rule.condition, ruleSet.variables)) {
      for (const action of rule.action) {
        executeAction(action, ruleSet.variables);
      }
    }
  }
}

export async function executeAction(action: Action, variables: { [name: string]: Value }): Promise<void> {
  switch (action.type) {
    case 'BUY_MARKET':
      const buyAmount = evaluateCondition(action.amount, variables);
      const symbol = action.symbol.replace('/','');
      const buyOrder = await placeOrder(symbol, 'BUY', buyAmount as number);
      sendMessage("Compré " + buyAmount as string + " " + action.symbol + "!")
      //Se pueden usar cosas de buyOrder e informarlas vía Discord
      break;
    case 'SELL_MARKET':
      const sellAmount = evaluateCondition(action.amount, variables);
      const ssymbol = action.symbol.replace('/','');
      const sellOrder = await placeOrder(ssymbol, 'SELL', sellAmount as number);
      sendMessage("Vendí " + sellAmount as string + " " + action.symbol + "!")
      break;
    case 'SET_VARIABLE':
      const newValue = evaluateCondition(action.value, variables);
      variables[action.name] = newValue;
      break;
    default:
      throw new Error(`Unsupported action type`);
  }
}