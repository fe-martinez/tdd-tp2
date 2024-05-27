import { ConditionEvaluator, ConditionEvaluatorVariables } from "../conditionStrategy/conditionEvaluator";
import { InvalidAmountError, MarketDataApi } from "../MarketDataApi/marketDataApi";
import { Action } from "./action";

export class SellMarketAction implements Action {
    private symbol: string;
    private amount: ConditionEvaluator;
    private marketDataApi: MarketDataApi;

    constructor(marketDataApi: MarketDataApi, symbol: string, amount: ConditionEvaluator) {
        this.marketDataApi = marketDataApi;
        this.symbol = symbol;
        this.amount = amount;
    }
    async execute(variables: ConditionEvaluatorVariables) {
        const amount = await this.amount.evaluate(variables);
        if (typeof amount !== 'number') {
            return Promise.reject(new InvalidAmountError(`Amount must be a number, but it is ${amount}`));
        }
        return this.marketDataApi.sellMarket(this.symbol, amount);
    }
}