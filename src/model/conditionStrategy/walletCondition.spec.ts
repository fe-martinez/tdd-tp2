import TestMarketDataApi from "../MarketDataApi/testMarketDataApi";
import walletCondition from "./walletCondition";

describe('WalletCondition', () => {
    const marketDataApi = new TestMarketDataApi();
    const variables = new Map<string, number>();

    beforeEach(() => {
        marketDataApi._setWallet('BTC', 10);
        marketDataApi._setWallet('USDT', 1000);
        marketDataApi._setWallet('ETH', 20);
    });

    it('should return value from wallet', async () => {
        const evaluator = new walletCondition(marketDataApi, 'BTC');
        expect(await evaluator.evaluate(variables)).toBe(10);
    });

    it('should return updated value from wallet', async () => {
        const evaluator = new walletCondition(marketDataApi, 'BTC');
        expect(await evaluator.evaluate(variables)).toBe(10);
        marketDataApi._setWallet('BTC', 20);
        expect(await evaluator.evaluate(variables)).toBe(20);
    });

});