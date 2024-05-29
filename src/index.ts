import { collectPairsFromRuleSet, parseRules } from './parser/parser';
import { RuleSet } from './model/types';
import { BinanceListener } from './data/binanceConnection';
import { ConditionEvaluator } from './dynamic-evaluator/conditionEvaluator';
import { executeRuleSet } from './dynamic-evaluator/rulesEvaluator';
import { MessageNotifier } from './notifier/notificationSender';
import { DiscordNotifier, discordConfigurationExists } from './notifier/discordNotifier';
import { SlackNotifier, slackConfigurationExists } from './notifier/slackNotifier';
import { Timer } from './timer/timer';
import { time } from 'console';

let ruleSet: RuleSet = parseRules('src/rules.json');
let pairs = collectPairsFromRuleSet(ruleSet);
const compiledRules = new ConditionEvaluator(ruleSet);
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
notifier.startTimer("Probando si envía mensajes con el timer integrado");

// const binanceData: BinanceListener = new BinanceListener(pairs);

// binanceData.on('error', (error) => {
//   console.error('WebSocket error:', error);
// });

// binanceData.on('connected', () => {
//  console.log('WebSocket connected');
// });

// binanceData.on('disconnected', ({ code, reason }) => {
//   console.log(`WebSocket disconnected (${code}): ${reason}`);
// });

// binanceData.on('update', (data) => {
//   executeRuleSet(compiledRules, notifier)
//     .then(() => {
//       console.log('Update from binance:', data);
//     })
//     .catch((error) => {
//       console.error('Error executing rule set:', error);
//     });
// });

//Para probar el timer
// function getHour() {
//   const now = new Date();
//   const hours = now.getHours();
//   const minutes = now.getMinutes();
//   const seconds = now.getSeconds();

//   const currentTime = `${hours}:${minutes}:${seconds}`;

//   return currentTime
// }

// console.log('Inicio del programa');
// console.log(getHour());
// let timer = new Timer(5 * 1000); //5 segundos
// timer.start(() => {
//   let hour = getHour()
//   console.log(hour);
// });

// timer.stop(); //Si llamo a esto inmediatamente después del start no se ejecuta el timer porque lo stopea correctamente


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