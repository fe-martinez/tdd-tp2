import { collectPairsFromRuleSet, parseRules } from './evaluator/parser';
import { RuleSet } from './model/types';
import { BinanceListener } from './data/binanceConnection';
import { evaluateRules } from './evaluator/rulesEvaluator';
import { ConditionEvaluator } from './dynamic-evaluator/conditionEvaluator';
import { executeRuleSet } from './dynamic-evaluator/rulesEvaluator';

// (async () => {
//     try {
//       //  console.log('Placing buy order...');
//       //  const buyOrder = await placeOrder('BTCUSDT', 'BUY', 0.01);
//       //  console.log('Buy Order:', buyOrder);
  
//       //  console.log('Placing sell order...');
//       //  const sellOrder = await placeOrder('BTCUSDT', 'SELL', 0.01);
//       //  console.log('Sell Order:', sellOrder);
      
//        console.log('Fetching order history...');
//        const orderHistory = await getOrderHistory('BTCUSDT');
//        console.log('Order History:', orderHistory);
//     } catch (error) {
//       console.error('Error in placing orders:', error);
//     }
// })();
//sendMessage("Hola bebetos, tengo logo, estoy liste para informar las alertas de Binance, soy un bot NO BINARIE")

let ruleSet: RuleSet = parseRules('src/rules.json');
let pairs = collectPairsFromRuleSet(ruleSet);

const compiledRules = new ConditionEvaluator(ruleSet);
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
  console.log('Update from binance:', data);
  evaluateRules(ruleSet);
});