import axios from 'axios';
import * as binanceApi from './binanceApi';
import { BinanceOrder } from './binanceApi';

jest.mock('axios'); 

describe('Binance API', () => {
  const mockApiKey = 'mockApiKey';
  const mockApiSecret = 'mockApiSecret';

  const originalEnv = process.env;

  beforeEach(() => {
    process.env.BINANCE_API_KEY = mockApiKey;
    process.env.BINANCE_API_SECRET = mockApiSecret;
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  describe('placeOrder', () => {
    it('should place an order successfully', async () => {
      const mockSymbol = 'BTCUSDT';
      const mockSide = 'BUY';
      const mockQuantity = 1;

      const mockPlaceOrderResponse = {
        symbol: 'BTCUSDT',
        orderId: 123456,
        status: 'FILLED',
        side: 'BUY',

      };

      (axios.post as jest.Mock).mockResolvedValueOnce({ data: mockPlaceOrderResponse });

      const response = await binanceApi.placeOrder(mockSymbol, mockSide, mockQuantity);

      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('https://testnet.binance.vision/api/v3/order'), null, {
        headers: {
          'X-MBX-APIKEY': mockApiKey,
        },
      });
      expect(response).toEqual(mockPlaceOrderResponse as BinanceOrder);
    });

    it('should throw an error if placing order fails', async () => {
      const mockSymbol = 'BTCUSDT';
      const mockSide = 'BUY';
      const mockQuantity = 1;

      const mockError = new Error('Failed to place order');
      (axios.post as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(binanceApi.placeOrder(mockSymbol, mockSide, mockQuantity)).rejects.toThrow(mockError);
    });
  });

  describe('getOrderHistory', () => {
    it('should get order history successfully', async () => {
      const mockSymbol = 'BTCUSDT';

      const mockOrderHistoryResponse = [
        {
          symbol: 'BTCUSDT',
          orderId: 123456,
          orderListId: -1,
          clientOrderId: 'myOrder1',
          price: '0.00000000',
          origQty: '1.00000000',
          executedQty: '1.00000000',
          cummulativeQuoteQty: '50000.00000000',
          status: 'FILLED',
          timeInForce: 'GTC',
          type: 'MARKET',
          side: 'BUY',
          stopPrice: '0.00000000',
          icebergQty: '0.00000000',
          time: 1622736148226,
          updateTime: 1622736148226,
          isWorking: true,
          origQuoteOrderQty: '0.00000000',
        },
      ];

      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockOrderHistoryResponse });

      const response = await binanceApi.getOrderHistory(mockSymbol);

      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('https://testnet.binance.vision/api/v3/allOrders'), {
        headers: {
          'X-MBX-APIKEY': mockApiKey,
        },
      });
      expect(response).toEqual(mockOrderHistoryResponse);
    });

    it('should throw an error if getting order history fails', async () => {
      const mockSymbol = 'BTCUSDT';

      const mockError = new Error('Failed to get order history');
      (axios.get as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(binanceApi.getOrderHistory(mockSymbol)).rejects.toThrow(mockError);
    });
  });
});

