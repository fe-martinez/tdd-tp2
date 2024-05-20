import WebSocket from 'ws';
import { getEndpointURI, getOrderBook, parsePairs } from './binanceParser';
import { addHistoricalData, getLastPairValue } from './database';
import { EventEmitter } from 'events';

const IMPORTANT_VARIATION = 0.0001;

export class BinanceListener extends EventEmitter {
  private binanceWs: WebSocket;

  constructor(pairs: string[]) {
    super();
    this.binanceWs = (connectToBinanceWebSocket(getUri(pairs)));
    this.setupListener();
  }

  private setupListener() {
    this.binanceWs.on('message', (data: Buffer) => {
      const textDecoder = new TextDecoder();
      const arrayBuffer = Uint8Array.from(data).buffer;
      const jsonString = textDecoder.decode(arrayBuffer);

      const orderBook = getOrderBook(jsonString);
      const lastValue = getLastPairValue(orderBook.symbol);
      const bands = [lastValue * (1 - IMPORTANT_VARIATION), lastValue * (1 + IMPORTANT_VARIATION)];
      if (parseFloat(orderBook.bestBidPrice) < bands[0] || parseFloat(orderBook.bestBidPrice) > bands[1]) {
        addHistoricalData(orderBook.symbol, { bestBidPrice: orderBook.bestBidPrice, bestAskPrice: orderBook.bestAskPrice, time: new Date().toISOString() });
        this.emit('update', { symbol: orderBook.symbol, bestBidPrice: orderBook.bestBidPrice, bestAskPrice: orderBook.bestAskPrice, time: new Date().toISOString() });
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