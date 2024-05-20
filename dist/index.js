"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./evaluator/parser");
const binanceConnection_1 = require("./evaluator/binanceConnection");
const binanceApi_1 = require("./binanceApi");
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
console.log('Pairs from file:', pairs);
//let pairs = ['BTC/USDT', 'ETH/USDT', 'ADA/USDT'];
let URI = (0, binanceConnection_1.getUri)(pairs);
console.log('WebSocket URI:', URI);
(0, binanceConnection_1.connectToBinanceWebSocket)(URI, ruleSet);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Placing buy order...');
        const buyOrder = yield (0, binanceApi_1.placeOrder)('BTCUSDT', 'BUY', 0.01);
        console.log('Buy Order:', buyOrder);
        console.log('Placing sell order...');
        const sellOrder = yield (0, binanceApi_1.placeOrder)('BTCUSDT', 'SELL', 0.01);
        console.log('Sell Order:', sellOrder);
        console.log('Fetching order history...');
        const orderHistory = yield (0, binanceApi_1.getOrderHistory)('BTCUSDT');
        console.log('Order History:', orderHistory);
    }
    catch (error) {
        console.error('Error in placing orders:', error);
    }
}))();
