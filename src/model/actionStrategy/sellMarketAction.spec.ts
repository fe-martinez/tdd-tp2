import { ConditionEvaluatorType } from "../conditionStrategy/conditionEvaluator";
import ConstantConditionEvaluator from "../conditionStrategy/constantConditionEvaluator";
import { InvalidAmountError } from "../MarketDataApi/marketDataApi";
import TestMarketDataApi from "../MarketDataApi/testMarketDataApi";
import SellMarketAction from "./sellMarketAction";

describe('SellMarketAction', () => {
    const marketDataApi = new TestMarketDataApi();
    const variables = new Map<string, ConditionEvaluatorType>();
    beforeEach(() => {
        marketDataApi._setWallet('BTC', 10);
        marketDataApi._setWallet('USDT', 1000);
        marketDataApi._setWallet('ETH', 20);
    });
    it('sellMarket decreases base wallet amount', async () => {
        const condition = new ConstantConditionEvaluator(1);
        const action = new SellMarketAction(marketDataApi, 'BTC/USDT', condition);
        await action.execute(variables);
        const btcWallet = await marketDataApi.getWallet("BTC");
        expect(btcWallet).toBe(9);
    });

    it('sellMarket throws error if condition does not resolve to number', async () => {
        const condition = new ConstantConditionEvaluator("1");
        const action = new SellMarketAction(marketDataApi, 'BTC/USDT', condition);
        await expect(action.execute(variables)).rejects.toThrow(InvalidAmountError);
    });
});