const BINANCE_ENDPOINT = 'wss://stream.binance.com:9443/ws/';
interface OrderBook {
    updateID: number;
    symbol: string;
    bestBidPrice: string;
    bestBidQuantity: string;
    bestAskPrice: string;
    bestAskQuantity: string;
}

export function getOrderBook(jsonString: string) : OrderBook {
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

export function parsePairs(pairs: string[]): string[] {
  return pairs.map(pair => pair.replace('/', '').toLowerCase());
}

export function getEndpointURI(pairs: string[]): string {
  let URI = BINANCE_ENDPOINT;
  pairs.forEach(pair => {
    URI += `${pair}@bookTicker/`;
  });
  URI = URI.slice(0, -1);
  return URI;
}