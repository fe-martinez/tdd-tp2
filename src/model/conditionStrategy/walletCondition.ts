import { MarketDataApi } from "../MarketDataApi/marketDataApi";
import { ConditionEvaluator, ConditionEvaluatorType, ConditionEvaluatorVariables } from "./conditionEvaluator";

export default class WalletCondition  implements ConditionEvaluator {
    private marketDataApi: MarketDataApi;
    private symbol: string;
    constructor(marketDataApi: MarketDataApi, symbol: string) {
        this.marketDataApi = marketDataApi;
        this.symbol = symbol;
    }

    evaluate(variables: ConditionEvaluatorVariables): Promise<ConditionEvaluatorType> {
        return this.marketDataApi.getWallet(this.symbol);
    }
}