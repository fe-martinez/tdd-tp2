import WebSocket from 'ws';
import { collectPairsFromRuleSet, parseRules } from './evaluator/parser';

function parsePairs(pairs: string[]): string[] {
  return pairs.map(pair => pair.replace('/', '').toLowerCase());
}

function getEndpointURI(pairs: string[]): string {
  let URI = 'wss://stream.binance.com:9443/ws/';
  pairs.forEach(pair => {
    URI += `${pair}@bookTicker/`;
  });
  URI = URI.slice(0, -1);
  return URI;
}
// {
  //   "u":400900217,     // order book updateId
  //   "s":"BNBUSDT",     // symbol
  //   "b":"25.35190000", // best bid price
  //   "B":"31.21000000", // best bid qty
  //   "a":"25.36520000", // best ask price
  //   "A":"40.66000000"  // best ask qty
  // }
function connectToBinanceWebSocket(pairs: string[]) {
  let parsedPairs = parsePairs(pairs);
  let URI = getEndpointURI(parsedPairs);
  const ws = new WebSocket(URI);

  ws.on('open', () => {
    console.log('Conexión WebSocket abierta con Binance');
  });  
  
  ws.on('message', (data: Buffer) => {
    const textDecoder = new TextDecoder();
    const arrayBuffer = Uint8Array.from(data).buffer;
    const jsonString = textDecoder.decode(arrayBuffer);
  
    try {
      const message = JSON.parse(jsonString);
      const updateID = message.u;
      const symbol = message.s;
      const bestBidPrice = message.b;
      const bestBidQuantity = message.B;
      const bestAskPrice = message.a;
      const bestAskQuantity = message.A;
  
      console.log(`Nuevo evento para el símbolo ${symbol} con ID de actualización ${updateID}, mejor precio de oferta ${bestBidPrice} y cantidad ${bestBidQuantity}, mejor precio de venta ${bestAskPrice} y cantidad ${bestAskQuantity}`);
    } catch (error) {
      console.error('Error al analizar los datos JSON:', error);
    }
  });

  ws.on('error', (error) => {
    console.error('Error en la conexión WebSocket:', error);
  });
}

// let ruleSet = parseRules('/home/claram97/tdd/tdd-tp2/src/evaluator/rules.json');
// console.log(ruleSet)
// let pairs = collectPairsFromRuleSet(ruleSet);
// console.log(pairs)
let pairs = ['BTC/USDT', 'ETH/USDT', 'ADA/USDT'];

connectToBinanceWebSocket(pairs);

// wss://stream.binance.com:9443/ws/<symbol>@bookTicker

// ej: wss://stream.binance.com:9443/ws/adausdt@bookTicker

//Usar redis para guardar y que se borre?