import TestMarketDataApi from "./testMarketDataApi";

describe('MarketDataApi', () => {
    const marketDataApi = new TestMarketDataApi();
    beforeEach(() => {
        marketDataApi.setWallet('BTC', 10);
        marketDataApi.setWallet('USDT', 1000);
    });

    it('getWallet returns 0 for unknown symbol', async () => {
        const symbol = 'ETH';
        const wallet = await marketDataApi.getWallet(symbol);
        expect(wallet).toBe(0);
    });

    it('getWallet returns value for known symbol', async () => {
        const symbol = 'BTC';
        const wallet = await marketDataApi.getWallet(symbol);
        expect(wallet).toBe(10);
    });

    it('getWallet returns value for different symbols', async () => {
        const btcSymbol = 'BTC';
        const usdtSymbol = 'USDT';
        const btcWallet = await marketDataApi.getWallet(btcSymbol);
        const usdtWallet = await marketDataApi.getWallet(usdtSymbol);
        expect(btcWallet).toBe(10);
        expect(usdtWallet).toBe(1000);
    });

});