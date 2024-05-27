import { MarketDataApi } from "../MarketDataApi/marketDataApi";
import { ConditionEvaluator, ConditionEvaluatorType, ConditionEvaluatorVariables } from "./conditionEvaluator";

export default class WalletConditionEvaluator  implements ConditionEvaluator {
    private marketDataApi: MarketDataApi;
    private symbol: string;
    constructor(marketDataApi: MarketDataApi, symbol: string) {
        this.marketDataApi = marketDataApi;
        this.symbol = symbol;
    }
    
    static fromJson(marketDataApi: MarketDataApi, json: any): ConditionEvaluator {
        if (!json.hasOwnProperty("symbol"))
            throw new Error("Wallet condition evaluator must have a symbol");
        if (typeof json.symbol !== 'string')
            throw new Error("Wallet condition evaluator symbol must be a string");
        return new WalletConditionEvaluator(marketDataApi, json.symbol);
    
    }

    evaluate(variables: ConditionEvaluatorVariables): Promise<ConditionEvaluatorType> {
        return this.marketDataApi.getWallet(this.symbol);
    }
}