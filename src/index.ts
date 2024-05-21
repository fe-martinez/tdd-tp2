import { collectPairsFromRuleSet, parseRules } from './evaluator/parser';
import { RuleSet } from './model/types';
import { BinanceListener } from './data/binanceConnection';
import { evaluateRules } from './evaluator/rulesEvaluator';
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
//Ejemplo para probar que el notifier funciona:
//notifier.sendNotification('Hello world!');

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
  async () => {
    await executeRuleSet(compiledRules, notifier);
  }
  console.log('Update from binance:', data);
});