import { collectPairsFromRuleSet, parseRules } from './parser/parser';
import { RuleSet } from './model/types';
import { BinanceListener } from './data/binanceConnection';
import { MessageNotifier } from './notifier/notificationSender';
import RulesEvaluator from './model/ruleEvaluator/rulesEvaluator';
import { readFileSync } from 'fs';
import { logAndSendNotification } from './helpers/logger';
import setupNotifiers from './notifier/notifiers';

process.env.NODE_ENV = 'production';

let ruleSet: RuleSet = parseRules('src/rules.json');
let pairs = collectPairsFromRuleSet(ruleSet);

const notifier = MessageNotifier.getInstance();
setupNotifiers(notifier);
notifier.sendNotification("App is now running");
//notifier.startTimer("Acá iría el mensaje que se envía cada vez que pasó un tiempo, descomentar esto cuando esté listo")
//notifier.startTimer("Probando si envía mensajes con el timer integrado");

const binanceData: BinanceListener = new BinanceListener(pairs);
const rulesData = readFileSync('src/rules.json', 'utf8');
const rulesJson = JSON.parse(rulesData);
const rulesEvaluator: RulesEvaluator = RulesEvaluator.fromJson(rulesJson);

binanceData.on('error', (error) => {
  logAndSendNotification(`WebSocket error: ${error}`, "error");
  console.error('WebSocket error:', error);
});

binanceData.on('connected', () => {
  logAndSendNotification('WebSocket connected');
  console.log('WebSocket connected');
});

binanceData.on('disconnected', ({ code, reason }) => {
  logAndSendNotification(`WebSocket disconnected (${code}): ${reason}`, "warn");
  console.log(`WebSocket disconnected (${code}): ${reason}`);
});

binanceData.on('update', () => {
  rulesEvaluator.evaluateRules();
  console.log('WebSocket update');
});