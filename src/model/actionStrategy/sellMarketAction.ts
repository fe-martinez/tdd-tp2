import { ConditionEvaluator, ConditionEvaluatorVariables } from "../conditionStrategy/conditionEvaluator";
import ConditionEvaluatorFactory from "../conditionStrategy/conditionEvaluatorFactory";
import { InvalidAmountError, MarketDataApi } from "../MarketDataApi/marketDataApi";
import { Action } from "./action";
import { logAndSendNotification } from "../../helpers/logger";

export default class SellMarketAction implements Action {
    private symbol: string;
    private amount: ConditionEvaluator;
    private marketDataApi: MarketDataApi;

    constructor(marketDataApi: MarketDataApi, symbol: string, amount: ConditionEvaluator) {
        this.marketDataApi = marketDataApi;
        this.symbol = symbol;
        this.amount = amount;
    }

    static fromJson(marketDataApi: MarketDataApi, json: any): SellMarketAction {
        if (!json.hasOwnProperty("symbol"))
            throw new Error("Sell market action must have a symbol");
        if (typeof json.symbol !== 'string')
            throw new Error("Sell market action symbol must be a string");
        if (!json.hasOwnProperty("amount"))
            throw new Error("Sell market action must have an amount");
        if (!json.amount.hasOwnProperty("type"))
            throw new Error("Sell market action amount must have a type");
    
        const validTypes = ['CONSTANT', 'VARIABLE', 'WALLET', 'CALL', 'DATA'];
        if (!validTypes.includes(json.amount.type.toUpperCase())) {
            throw new Error("Sell market action amount must be constant, variable, wallet, call or data");
        }

        const amountEvaluator = new ConditionEvaluatorFactory(json.amount).create();
        return new SellMarketAction(marketDataApi, json.symbol, amountEvaluator);
    }

    async execute(variables: ConditionEvaluatorVariables) {
        const amount = await this.amount.evaluate(variables);
        if (typeof amount !== 'number') {
            return Promise.reject(new InvalidAmountError(`Amount must be a number, but it is ${amount}`));
        }
        logAndSendNotification(`Selling ${amount} of ${this.symbol}`);
        return this.marketDataApi.sellMarket(this.symbol, amount);
    }
}