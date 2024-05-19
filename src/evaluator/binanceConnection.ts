import WebSocket from 'ws';
import { getEndpointURI, getOrderBook, parsePairs } from './binanceParser';
import { RuleSet } from './types'; 
import { evaluateRules } from './rulesEvaluator'; 

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

function handleMessage(ws: WebSocket, ruleSet: RuleSet) {
  ws.on('message', (data: Buffer) => {
    const textDecoder = new TextDecoder();
    const arrayBuffer = Uint8Array.from(data).buffer;
    const jsonString = textDecoder.decode(arrayBuffer);

    try {
      let orderBook = getOrderBook(jsonString);
      console.log(`Nuevo evento para el símbolo ${orderBook.symbol} con ID de actualización ${orderBook.updateID}, mejor precio de oferta ${orderBook.bestBidPrice} y cantidad ${orderBook.bestBidQuantity}, mejor precio de venta ${orderBook.bestAskPrice} y cantidad ${orderBook.bestAskQuantity}`);
      
      evaluateRules(ruleSet);
    } catch (error) {
      console.error('Error al analizar los datos JSON:', error);
    }
  });
}


// {
  //   "u":400900217,     // order book updateId
  //   "s":"BNBUSDT",     // symbol
  //   "b":"25.35190000", // best bid price
  //   "B":"31.21000000", // best bid qty
  //   "a":"25.36520000", // best ask price
  //   "A":"40.66000000"  // best ask qty
  // }
export function connectToBinanceWebSocket(URI: string, ruleSet: RuleSet) {
    const ws = new WebSocket(URI);
  
    openConnection(ws);
    handleMessage(ws, ruleSet);
    errorConnection(ws);
}

export function getUri(pairs: string[]): string {
    const parsedPairs = parsePairs(pairs);
    return getEndpointURI(parsedPairs);
}