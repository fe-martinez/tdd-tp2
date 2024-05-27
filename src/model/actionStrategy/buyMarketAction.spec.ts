import { ConditionEvaluatorType } from "../conditionStrategy/conditionEvaluator";
import ConstantConditionEvaluator from "../conditionStrategy/constantConditionEvaluator";
import { InvalidAmountError } from "../MarketDataApi/marketDataApi";
import TestMarketDataApi from "../MarketDataApi/testMarketDataApi";
import BuyMarketAction from "./buyMarketAction";

describe('BuyMarketAction', () => {
    const marketDataApi = new TestMarketDataApi();
    const variables = new Map<string, ConditionEvaluatorType>();
    beforeEach(() => {
        marketDataApi._setWallet('BTC', 10);
        marketDataApi._setWallet('USDT', 1000);
        marketDataApi._setWallet('ETH', 20);
    });
    it('buyMarket increases base wallet amount', async () => {
        const condition = new ConstantConditionEvaluator(1);
        const action = new BuyMarketAction(marketDataApi, 'BTC/USDT', condition);
        await action.execute(variables);
        const btcWallet = await marketDataApi.getWallet("BTC");
        expect(btcWallet).toBe(11);
    });

    it('buyMarket throws error if condition does not resolve to number', async () => {
        const condition = new ConstantConditionEvaluator("1");
        const action = new BuyMarketAction(marketDataApi, 'BTC/USDT', condition);
        await expect(action.execute(variables)).rejects.toThrow(InvalidAmountError);
    });
});