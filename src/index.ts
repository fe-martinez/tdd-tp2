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

function openConnection(ws: WebSocket) {
  ws.on('open', () => {
    console.log('Conexión WebSocket abierta con Binance');
  }); 
}

function errorConnection(ws: WebSocket) {
  ws.on('error', (error) => {
    console.error('Error en la conexión WebSocket:', error);
  });
}

function getOrderBook(jsonString: string) : OrderBook {
  const message = JSON.parse(jsonString);
  const orderBook: OrderBook = {
    updateID: message.u,
    symbol: message.s,
    bestBidPrice: message.b,
    bestBidQuantity: message.B,
    bestAskPrice: message.a,
    bestAskQuantity: message.A
  };
  return orderBook;
}

function handleMessage(ws: WebSocket) {
  ws.on('message', (data: Buffer) => {
    const textDecoder = new TextDecoder();
    const arrayBuffer = Uint8Array.from(data).buffer;
    const jsonString = textDecoder.decode(arrayBuffer);
  
    try {
      let orderBook = getOrderBook(jsonString)      
      console.log(`Nuevo evento para el símbolo ${orderBook.symbol} con ID de actualización ${orderBook.updateID}, mejor precio de oferta ${orderBook.bestBidPrice} y cantidad ${orderBook.bestBidQuantity}, mejor precio de venta ${orderBook.bestAskPrice} y cantidad ${orderBook.bestAskQuantity}`);
    } catch (error) {
      console.error('Error al analizar los datos JSON:', error);
    }
  });
}
interface OrderBook {
  updateID: number;
  symbol: string;
  bestBidPrice: string;
  bestBidQuantity: string;
  bestAskPrice: string;
  bestAskQuantity: string;
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

  openConnection(ws);
  handleMessage(ws);
  errorConnection(ws);
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