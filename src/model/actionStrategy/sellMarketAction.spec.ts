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

    it('parses a valid json correctly', () => {
        const json = {
            "type": "SELL_MARKET",
            "symbol": "BTC/USDT",
            "amount": {
                "type": "CONSTANT",
                "value": 1
            }
        };
        const action = SellMarketAction.fromJson(marketDataApi, json);
        expect(action).toBeInstanceOf(SellMarketAction);
    });

    it('throws error if json does not have symbol', () => {
        const json = {
            "type": "SELL_MARKET",
            "amount": {
                "type": "CONSTANT",
                "value": 1
            }
        };
        expect(() => SellMarketAction.fromJson(marketDataApi, json)).toThrow(Error);
    });

    it('throws error if json does not have amount', () => {
        const json = {
            "type": "SELL_MARKET",
            "symbol": "BTC/USDT"
        };
        expect(() => SellMarketAction.fromJson(marketDataApi, json)).toThrow(Error);
    });

    it('throws error if json does not have amount type', () => {
        const json = {
            "type": "SELL_MARKET",
            "symbol": "BTC/USDT",
            "amount": {
                "value": 1
            }
        };
        expect(() => SellMarketAction.fromJson(marketDataApi, json)).toThrow(Error);
    });

    it('throws error if amount type is not constant, variable or wallet', () => {
        const json = {
            "type": "SELL_MARKET",
            "symbol": "BTC/USDT",
            "amount": {
                "type": "CALL",
                "value": 1
            }
        };
        expect(() => SellMarketAction.fromJson(marketDataApi, json)).toThrow(Error);
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