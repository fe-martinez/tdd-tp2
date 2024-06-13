import fs from 'fs';
import { collectPairsFromRuleSet, parseRules } from './parser/parser';
import { RuleSet } from './model/types';
import { BinanceListener } from './data/binanceConnection';
import { MessageNotifier } from './notifier/notificationSender';
import RulesEvaluator from './model/ruleEvaluator/rulesEvaluator';
import { readFileSync } from 'fs';
import { logAndSendNotification } from './helpers/logger';
import setupNotifiers from './notifier/notifiers';

process.env.NODE_ENV = 'production';

const rulesFilePath = process.argv[2];
if (!rulesFilePath || !fs.existsSync(rulesFilePath)) {
  throw new Error('No se especificó el archivo de reglas o no existe');
}

let ruleSet: RuleSet = parseRules(rulesFilePath);
let pairs = collectPairsFromRuleSet(ruleSet);

const notifier = MessageNotifier.getInstance();
setupNotifiers(notifier);
notifier.sendNotification("App is now running");
//notifier.startTimer("Acá iría el mensaje que se envía cada vez que pasó un tiempo, descomentar esto cuando esté listo")
//notifier.startTimer("Probando si envía mensajes con el timer integrado");

const binanceData: BinanceListener = new BinanceListener(pairs);
const rulesData = readFileSync(rulesFilePath, 'utf8');
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

let isEvaluating = false;

binanceData.on('update', async () => {
  if (isEvaluating) {
    console.log('Previous evaluation still running, skipping this update');
    return;
  }

  isEvaluating = true;
  try {
    await rulesEvaluator.evaluateRules();
    console.log('WebSocket update');
  } catch (error) {
    console.error('Error evaluating rules:', error);
  } finally {
    isEvaluating = false;
  }
});