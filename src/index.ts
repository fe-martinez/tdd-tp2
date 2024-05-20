import { collectPairsFromRuleSet, parseRules } from './evaluator/parser';
import { connectToBinanceWebSocket, getUri } from './data/binanceConnection';

//Esto no sé por qué no funciona, es lo que debería permitirnos obtener las reglas del archivo rules.json
// function getPairsFromFile(filePath: string): any {
//   let ruleSet = parseRules('/home/claram97/tdd/tdd-tp2/src/evaluator/rules.json');
//   console.log(ruleSet)
//   let pairs = collectPairsFromRuleSet(ruleSet);
//   console.log(pairs)
// }
// creo q asi deberia funcionar
function getPairsFromFile(filePath: string): any {
    let ruleSet = parseRules(filePath);
    console.log(ruleSet);
    let pairs = collectPairsFromRuleSet(ruleSet);
    console.log(pairs);
    return { pairs, ruleSet };
  }
let { pairs, ruleSet } = getPairsFromFile('src/rules.json');

let URI = getUri(pairs);
connectToBinanceWebSocket(URI, ruleSet);