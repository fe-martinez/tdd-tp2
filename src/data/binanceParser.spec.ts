import { getOrderBook, parsePairs, getEndpointURI } from './binanceParser';

describe('Binance Parser', () => {
  describe('getOrderBook', () => {
    it('should parse the JSON string correctly and return the order book object', () => {
      const jsonString = '{"u":12345,"s":"BTCUSDT","b":"10000","B":"0.5","a":"10010","A":"0.8"}';
      const expectedOrderBook = {
        updateID: 12345,
        symbol: 'BTCUSDT',
        bestBidPrice: '10000',
        bestBidQuantity: '0.5',
        bestAskPrice: '10010',
        bestAskQuantity: '0.8'
      };

      const result = getOrderBook(jsonString);

      expect(result).toEqual(expectedOrderBook);
    });
  });

  describe('parsePairs', () => {
    it('should parse pairs correctly', () => {
      const pairs = ['BTC/USDT', 'ETH/BTC'];
      const expectedParsedPairs = ['btcusdt', 'ethbtc'];

      const result = parsePairs(pairs);

      expect(result).toEqual(expectedParsedPairs);
    });

    it('should handle lowercase pairs correctly', () => {
      const pairs = ['btc/usdt', 'eth/btc'];
      const expectedParsedPairs = ['btcusdt', 'ethbtc'];

      const result = parsePairs(pairs);

      expect(result).toEqual(expectedParsedPairs);
    });
  });

  describe('getEndpointURI', () => {
    it('should generate the correct URI for pairs', () => {
      const pairs = ['btcusdt', 'ethbtc'];
      const expectedURI = 'wss://stream.binance.com:9443/ws/btcusdt@bookTicker/ethbtc@bookTicker';

      const result = getEndpointURI(pairs);

      expect(result).toEqual(expectedURI);
    });
  });
});
