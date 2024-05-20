import WebSocket from 'ws';
import { getEndpointURI, getOrderBook, parsePairs } from './binanceParser';
import { RuleSet } from '../model/types'; 
import { evaluateRules } from '../evaluator/rulesEvaluator'; 
import { addHistoricalData, Data, getLastPairValue } from './database';

const IMPORTANT_VARIATION = 0.001;

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
      // Check if the event is worth saving. (if bestBidPrice has increased or lowered more than 0.1% since last event saved)
      const lastValue = getLastPairValue(orderBook.symbol);
      const bands = [lastValue * (1 - IMPORTANT_VARIATION), lastValue * (1 + IMPORTANT_VARIATION)];
      if (parseFloat(orderBook.bestBidPrice) < bands[0] || parseFloat(orderBook.bestBidPrice) > bands[1]) {
        console.log(`El evento es importante, se guardará el valor del mejor precio de oferta`);
        addHistoricalData(orderBook.symbol, {bestBidPrice: orderBook.bestBidPrice, bestAskPrice: orderBook.bestAskPrice, time: new Date().toISOString()});
        evaluateRules(ruleSet);
      } else {
        console.log(`El evento no es menor a la banda baja: ${bands[0]} o mayor a la banda alta: ${bands[1]}`);
      }
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