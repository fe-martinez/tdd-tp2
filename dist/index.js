"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./evaluator/parser");
const binanceConnection_1 = require("./evaluator/binanceConnection");
//Esto no sé por qué no funciona, es lo que debería permitirnos obtener las reglas del archivo rules.json
// function getPairsFromFile(filePath: string): any {
//   let ruleSet = parseRules('/home/claram97/tdd/tdd-tp2/src/evaluator/rules.json');
//   console.log(ruleSet)
//   let pairs = collectPairsFromRuleSet(ruleSet);
//   console.log(pairs)
// }
// creo q asi deberia funcionar
function getPairsFromFile(filePath) {
    let ruleSet = (0, parser_1.parseRules)(filePath);
    console.log(ruleSet);
    let pairs = (0, parser_1.collectPairsFromRuleSet)(ruleSet);
    console.log(pairs);
    return { pairs, ruleSet };
}
let { pairs, ruleSet } = getPairsFromFile('/Users/paulabruck/Desktop/FIUBA/Tecnicas_De_Diseño/tdd-tp2/src/evaluator/rules.json');
//let pairs = ['BTC/USDT', 'ETH/USDT', 'ADA/USDT'];
let URI = (0, binanceConnection_1.getUri)(pairs);
(0, binanceConnection_1.connectToBinanceWebSocket)(URI, ruleSet);
