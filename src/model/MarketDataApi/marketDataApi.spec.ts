import { InsufficientFundsError } from "./marketDataApi";
import TestMarketDataApi from "./testMarketDataApi";

describe('MarketDataApi', () => {
    const marketDataApi = new TestMarketDataApi();
    beforeEach(() => {
        marketDataApi._setWallet('BTC', 10);
        marketDataApi._setWallet('USDT', 1000);
        marketDataApi._setWallet('ETH', 20);
    });

    it('getWallet returns 0 for unknown symbol', async () => {
        const symbol = 'DOGE';
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


    it('buyMarket increases base wallet amount', async () => {
        const symbol = 'BTC/USDT';
        const amount = 1;
        await marketDataApi.buyMarket(symbol, amount);
        const btcWallet = await marketDataApi.getWallet("BTC");
        expect(btcWallet).toBe(11);
    });

    it('buyMarket does not change other wallet amount', async () => {
        const symbol = 'BTC/USDT';
        const amount = 1;
        await marketDataApi.buyMarket(symbol, amount);
        const usdTWallet = await marketDataApi.getWallet("ETH");
        expect(usdTWallet).toBe(20);
    });

    it('buyMarket does not change base wallet amount if not enough quote', async () => {
        const symbol = 'BTC/USDT';
        const amount = 2000;
        try {
            await marketDataApi.buyMarket(symbol, amount);
        } catch (error) {
            const btcWallet = await marketDataApi.getWallet("BTC");
            expect(btcWallet).toBe(10);
        }
    });

    it('buyMarket throws error if not enough quote', async () => {
        const symbol = 'BTC/USDT';
        const amount = 2000;
        await expect(marketDataApi.buyMarket(symbol, amount)).rejects.toThrow(InsufficientFundsError);
    });

    it('buyMarket decreases quote wallet amount', async () => {
        const symbol = 'BTC/USDT';
        const amount = 1;
        await marketDataApi.buyMarket(symbol, amount);
        const usdTWallet = await marketDataApi.getWallet("USDT");
        expect(usdTWallet).toBe(999);
    });

    it('buyMarket decreases quote wallet amount by amount', async () => {
        const symbol = 'BTC/USDT';
        const amount = 1;
        await marketDataApi.buyMarket(symbol, amount);
        const usdTWallet = await marketDataApi.getWallet("USDT");
        expect(usdTWallet).toBe(999);
    });

    it('sellMarket decreases base wallet amount', async () => {
        const symbol = 'BTC/USDT';
        const amount = 1;
        await marketDataApi.sellMarket(symbol, amount);
        const btcWallet = await marketDataApi.getWallet("BTC");
        expect(btcWallet).toBe(9);
    });

    it('sellMarket does not change other wallet amount', async () => {
        const symbol = 'BTC/USDT';
        const amount = 1;
        await marketDataApi.sellMarket(symbol, amount);
        const usdTWallet = await marketDataApi.getWallet("ETH");
        expect(usdTWallet).toBe(20);
    });

    it('sellMarket does not change base wallet amount if not enough base', async () => {
        const symbol = 'BTC/USDT';
        const amount = 20;
        try {
            await marketDataApi.sellMarket(symbol, amount);
        } catch (error) {
            const btcWallet = await marketDataApi.getWallet("BTC");
            expect(btcWallet).toBe(10);
        }
    });

    it('sellMarket throws error if not enough base', async () => {
        const symbol = 'BTC/USDT';
        const amount = 20;
        await expect(marketDataApi.sellMarket(symbol, amount)).rejects.toThrow(InsufficientFundsError);
    });

    it('sellMarket increases quote wallet amount', async () => {
        const symbol = 'BTC/USDT';
        const amount = 1;
        await marketDataApi.sellMarket(symbol, amount);
        const usdTWallet = await marketDataApi.getWallet("USDT");
        expect(usdTWallet).toBe(1001);
    });

    it('sellMarket increases quote wallet amount by amount', async () => {
        const symbol = 'BTC/USDT';
        const amount = 5;
        await marketDataApi.sellMarket(symbol, amount);
        const usdTWallet = await marketDataApi.getWallet("USDT");
        expect(usdTWallet).toBe(1005);
    });
});