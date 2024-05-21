import { collectPairsFromRuleSet, parseRules } from './parser/parser';
import { RuleSet } from './model/types';
import { BinanceListener } from './data/binanceConnection';
import { ConditionEvaluator } from './dynamic-evaluator/conditionEvaluator';
import { executeRuleSet } from './dynamic-evaluator/rulesEvaluator';
import { MessageNotifier, DiscordNotifier, SlackNotifier } from './notifier/notificationSender';

let ruleSet: RuleSet = parseRules('src/rules.json');
let pairs = collectPairsFromRuleSet(ruleSet);
const compiledRules = new ConditionEvaluator(ruleSet);
const notifier = new MessageNotifier();
const discordNotifier = new DiscordNotifier(notifier);
discordNotifier.start();
const slackNotifier = new SlackNotifier(notifier);
slackNotifier.start();

const binanceData: BinanceListener = new BinanceListener(pairs);

binanceData.on('error', (error) => {
  console.error('WebSocket error:', error);
});

binanceData.on('connected', () => {
 console.log('WebSocket connected');
});

binanceData.on('disconnected', ({ code, reason }) => {
  console.log(`WebSocket disconnected (${code}): ${reason}`);
});

binanceData.on('update', (data) => {
  executeRuleSet(compiledRules, notifier)
    .then(() => {
      console.log('Update from binance:', data);
    })
    .catch((error) => {
      console.error('Error executing rule set:', error);
    });
});

//Para probar que la wallet siga funcionando
// async function order() {
//   try {
//     var order = await placeOrder('BTCUSDT', 'BUY', 0.001);
//     console.log(order);
//   }
//   catch (error) {
//     console.error('Error al enviar la orden:', error);
//   }
// }

// order();