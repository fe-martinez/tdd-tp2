import { addHistoricalData, clearAllHistoricalData, getLastPairValue, getHistoricalData, getHistoricalPairValues, clearHistoricalData } from './database';

describe('Database', () => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 3600000); // 1 hour ago

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addHistoricalData', () => {
    beforeAll(() => {
      clearAllHistoricalData();
    });

    it('should add historical data correctly', () => {
      const symbol = 'BTCUSDT';
      const data = {
        bestBidPrice: '10000',
        bestAskPrice: '10010',
        time: now
      };
      addHistoricalData(symbol, data);
      const historicalData = getHistoricalData(symbol, 1, 0); // Since 1 hour ago until now
      expect(historicalData.length).toBe(1);
      expect(historicalData[0]).toEqual(data);
    });
  });

  describe('getLastPairValue', () => {
    beforeAll(() => {
      clearAllHistoricalData();
    });

    it('should return the last pair value correctly', () => {
      const symbol = 'BTCUSDT';
      const data = {
        bestBidPrice: '10000',
        bestAskPrice: '10010',
        time: now
      };
      addHistoricalData(symbol, data);
      const lastPairValue = getLastPairValue(symbol);
      expect(lastPairValue).toBe(parseFloat(data.bestBidPrice));
      clearAllHistoricalData();
    });

    it('should return 0 if there is no historical data', () => {
      const symbol = 'BTCUSDT';
      const lastPairValue = getLastPairValue(symbol);
      expect(lastPairValue).toBe(0);
      clearAllHistoricalData();
    });
  });

  describe('getHistoricalData', () => {
    beforeAll(() => {
      clearAllHistoricalData();
      const symbol = 'BTCUSDT';
      const data1 = {
        bestBidPrice: '10000',
        bestAskPrice: '10010',
        time: now
      };
      const data2 = {
        bestBidPrice: '10100',
        bestAskPrice: '10110',
        time: now
      };
      addHistoricalData(symbol, data1);
      addHistoricalData(symbol, data2);
    });

    it('should return historical data within the specified time range', () => {
      const symbol = 'BTCUSDT';
      const data1 = {
        bestBidPrice: '10000',
        bestAskPrice: '10010',
        time: now
      };
      const data2 = {
        bestBidPrice: '10100',
        bestAskPrice: '10110',
        time: now
      };
      const historicalData = getHistoricalData(symbol, 1, 0); // Since 1 hour ago until now
      expect(historicalData.length).toBe(2);
      expect(historicalData[0]).toEqual(data1);
      expect(historicalData[1]).toEqual(data2);
    });
  });

  describe('getHistoricalPairValues', () => {
    beforeAll(() => {
      clearAllHistoricalData();
    });

    it('should return historical pair values within the specified time range', () => {
      const symbol = 'BTCUSDT';
      const data1 = {
        bestBidPrice: '10000',
        bestAskPrice: '10010',
        time: now
      };
      const data2 = {
        bestBidPrice: '10100',
        bestAskPrice: '10110',
        time: now
      };
      addHistoricalData(symbol, data1);
      addHistoricalData(symbol, data2);
      const historicalPairValues = getHistoricalPairValues(symbol, 1, 0); // Since 1 hour ago until now
      expect(historicalPairValues.length).toBe(2);
      expect(historicalPairValues[0]).toBe(parseFloat(data1.bestBidPrice));
      expect(historicalPairValues[1]).toBe(parseFloat(data2.bestBidPrice));
    });
  });

  describe('clearAllHistoricalData', () => {

    beforeEach(() => {
      clearAllHistoricalData();
    });

    it('should clear all historical data after one hour old', () => {
      const symbol = 'BTCUSDT';
      const times = [
        new Date(now.getTime() - 10800000), // 3 hours ago
        new Date(now.getTime() - 7200000), // 2 hours ago
        new Date(now.getTime() - 3600000), // 1 hour ago
        new Date()
      ];
      times.forEach(time => {
        const data = {
          bestBidPrice: '10000',
          bestAskPrice: '10010',
          time
        };
        addHistoricalData(symbol, data);
      });
      clearHistoricalData();
      const historicalData = getHistoricalData(symbol, 10800001, 0); // Since 3 hour ago until now
      expect(historicalData.length).toBe(1);
    });

    it('should automatically clear all historical data after one hour old when adding new data', () => {
      const symbol = 'BTCUSDT';
      const times = [
        new Date(now.getTime() - 10800000), // 3 hours ago
        new Date(now.getTime() - 7200000), // 2 hours ago
        new Date(now.getTime() - 3600000), // 1 hour ago
        new Date()
      ];
      times.forEach(time => {
        const data = {
          bestBidPrice: '10000',
          bestAskPrice: '10010',
          time
        };
        addHistoricalData(symbol, data);
      });
      const historicalData = getHistoricalData(symbol, 10800001, 0); // Since 3 hour ago until now
      expect(historicalData.length).toBe(1);
    });
  });
});
