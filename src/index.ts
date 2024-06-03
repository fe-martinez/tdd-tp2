import { collectPairsFromRuleSet, parseRules } from './parser/parser';
import { RuleSet } from './model/types';
import { BinanceListener } from './data/binanceConnection';
import { MessageNotifier, DiscordNotifier, SlackNotifier } from './notifier/notificationSender';
import RulesEvaluator from './model/ruleEvaluator/rulesEvaluator';
import { readFileSync } from 'fs';
import { placeOrder } from './data/binanceApi';

let ruleSet: RuleSet = parseRules('src/rules.json');
let pairs = collectPairsFromRuleSet(ruleSet);

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

const rulesData = readFileSync('src/rules.json', 'utf8');
const rulesJson = JSON.parse(rulesData);


const rulesEvaluator: RulesEvaluator = RulesEvaluator.fromJson(rulesJson);

binanceData.on('update', () => {
  rulesEvaluator.evaluateRules();
  console.log('WebSocket update');
});

//Para probar que la wallet siga funcionando
async function order() {
  try {
    var order = await placeOrder('BTCUSDT', 'BUY', 0.001);
    console.log(order);
  }
  catch (error) {
    //console.error('Error al enviar la orden:', error);
  }
}

order();