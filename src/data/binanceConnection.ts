import WebSocket from 'ws';
import { getEndpointURI, getOrderBook, parsePairs } from './binanceParser';
import { addHistoricalData, getLastPairValue } from './database';
import  EventEmitter  from 'events';

require('dotenv').config();
const IMPORTANT_VARIATION = process.env.IMPORTANT_VARIATION ? parseFloat(process.env.IMPORTANT_VARIATION) : 0.01;

export class BinanceListener extends EventEmitter {
  private binanceWs: WebSocket;
  private textDecoder: TextDecoder;

  constructor(pairs: string[]) {
    super();
    this.binanceWs = (connectToBinanceWebSocket(getUri(pairs)));
    this.setupListener();
    this.textDecoder = new TextDecoder();
  }

  private setupListener() {
    this.binanceWs.on('message', (data: Buffer) => {
      const arrayBuffer = Uint8Array.from(data).buffer;
      const jsonString = this.textDecoder.decode(arrayBuffer);

      const orderBook = getOrderBook(jsonString);
      const lastSavedValue = getLastPairValue(orderBook.symbol);
      console.log("update no significativo");
      console.log(IMPORTANT_VARIATION);
      if (isImportantChange(orderBook, lastSavedValue)) {
        addHistoricalData(orderBook.symbol, { bestBidPrice: orderBook.bestBidPrice, bestAskPrice: orderBook.bestAskPrice, time: new Date() });
        this.emit('update', { symbol: orderBook.symbol, bestBidPrice: orderBook.bestBidPrice, bestAskPrice: orderBook.bestAskPrice, time: new Date() });
        console.log("update");
      }
    });

    this.binanceWs.on('error', (error) => {
      console.error('Error en la conexión WebSocket:', error);
    });

    this.binanceWs.on('open', () => {
      console.log('Conexión WebSocket abierta con Binance');
    }); 

  }
}

export function connectToBinanceWebSocket(URI: string): WebSocket {
    const ws = new WebSocket(URI);
    return ws;
}

export function getUri(pairs: string[]): string {
    const parsedPairs = parsePairs(pairs);
    return getEndpointURI(parsedPairs);
}

export function isImportantChange(orderBook: any, lastValue: number): boolean {
  const bands = [lastValue * (1 - IMPORTANT_VARIATION), lastValue * (1 + IMPORTANT_VARIATION)];
  return parseFloat(orderBook.bestBidPrice) < bands[0] || parseFloat(orderBook.bestBidPrice) > bands[1];
}