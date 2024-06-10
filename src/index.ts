import { collectPairsFromRuleSet, parseRules } from './parser/parser';
import { RuleSet } from './model/types';
import { BinanceListener } from './data/binanceConnection';
import { MessageNotifier } from './notifier/notificationSender';
import RulesEvaluator from './model/ruleEvaluator/rulesEvaluator';
import { readFileSync } from 'fs';
import logger from './helpers/logger';
import { discordConfigurationExists, DiscordNotifier } from './notifier/discordNotifier';
import { slackConfigurationExists, SlackNotifier } from './notifier/slackNotifier';

let ruleSet: RuleSet = parseRules('src/rules.json');
let pairs = collectPairsFromRuleSet(ruleSet);

const notifier = new MessageNotifier();

if (discordConfigurationExists()) {
  const discordNotifier = new DiscordNotifier(notifier);
  discordNotifier.listen();
}

if (slackConfigurationExists()) {
  const slackNotifier = new SlackNotifier(notifier);
  slackNotifier.listen();
}

notifier.sendNotification("App is now running");
//notifier.startTimer("Acá iría el mensaje que se envía cada vez que pasó un tiempo, descomentar esto cuando esté listo")
//notifier.startTimer("Probando si envía mensajes con el timer integrado");

const binanceData: BinanceListener = new BinanceListener(pairs);
const rulesData = readFileSync('src/rules.json', 'utf8');
const rulesJson = JSON.parse(rulesData);
const rulesEvaluator: RulesEvaluator = RulesEvaluator.fromJson(rulesJson);

binanceData.on('error', (error) => {
  logger(`WebSocket error: ${error}`, "error");
  console.error('WebSocket error:', error);
});

binanceData.on('connected', () => {
  logger('WebSocket connected');
  console.log('WebSocket connected');
});

binanceData.on('disconnected', ({ code, reason }) => {
  logger(`WebSocket disconnected (${code}): ${reason}`, "warn");
  console.log(`WebSocket disconnected (${code}): ${reason}`);
});

binanceData.on('update', () => {
  rulesEvaluator.evaluateRules(notifier);
  console.log('WebSocket update');
  rulesEvaluator.evaluateRules();
});

//Para probar que la wallet siga funcionando
// async function order() {
//   try {
//     var order = await placeOrder('BTCUSDT', 'BUY', 0.001);
//     console.log(order);
//   }
//   catch (error) {
//     //console.error('Error al enviar la orden:', error);
//   }
// }

// order();