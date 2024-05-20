import { collectPairsFromRuleSet, parseRules } from './evaluator/parser';
import { RuleSet } from './model/types';
import { BinanceListener } from './data/binanceConnection';
import { evaluateRules } from './evaluator/rulesEvaluator';
import { ConditionEvaluator } from './dynamic-evaluator/conditionEvaluator';
import { executeRuleSet } from './dynamic-evaluator/rulesEvaluator';


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

// var date = new Date();
// console.log(date);
// console.log(date.getDay());
// console.log(date.getFullYear());
// console.log(date.getHours());
// console.log(date.getMinutes());
// console.log(date.getMilliseconds());
// console.log(date.getMonth());
// console.log(date.getSeconds());