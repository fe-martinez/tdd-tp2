import { collectPairsFromRuleSet, parseRules } from './evaluator/parser';
import { connectToBinanceWebSocket, getUri } from './data/binanceConnection';
import { placeOrder , getOrderHistory} from './data/binanceApi';

// creo q asi deberia funcionar
// function getPairsFromFile(filePath: string): any {
//     let ruleSet = parseRules(filePath);
//     console.log(ruleSet);
//     let pairs = collectPairsFromRuleSet(ruleSet);
//     console.log(pairs);
//     return { pairs, ruleSet };
//   }
// let { pairs, ruleSet } = getPairsFromFile('/Users/paulabruck/Desktop/FIUBA/Tecnicas_De_Diseño/tdd-tp2/src/evaluator/rules.json');
// console.log('Pairs from file:', pairs);

// //let pairs = ['BTC/USDT', 'ETH/USDT', 'ADA/USDT'];

// let URI = getUri(pairs);
// console.log('WebSocket URI:', URI);
// connectToBinanceWebSocket(URI, ruleSet);

// function getPairsFromFile(filePath: string): any {
//     let ruleSet = parseRules(filePath);
//     console.log(ruleSet);
//     let pairs = collectPairsFromRuleSet(ruleSet);
//     console.log(pairs);
//     return { pairs, ruleSet };
//   }
// let { pairs, ruleSet } = getPairsFromFile('src/rules.json');

(async () => {
    try {
      //  console.log('Placing buy order...');
      //  const buyOrder = await placeOrder('BTCUSDT', 'BUY', 0.01);
      //  console.log('Buy Order:', buyOrder);
  
      //  console.log('Placing sell order...');
      //  const sellOrder = await placeOrder('BTCUSDT', 'SELL', 0.01);
      //  console.log('Sell Order:', sellOrder);
      
       console.log('Fetching order history...');
       const orderHistory = await getOrderHistory('BTCUSDT');
       console.log('Order History:', orderHistory);
    } catch (error) {
      console.error('Error in placing orders:', error);
    }
})();
  