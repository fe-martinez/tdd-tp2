import BinanceApi from "../MarketDataApi/binanceApi";
import TestMarketDataApi from "../MarketDataApi/testMarketDataApi";
import CallConditionEvaluator from "./callConditionEvaluator";
import { ConditionEvaluator } from "./conditionEvaluator";
import ConstantConditionEvaluator from "./constantConditionEvaluator";
import DataConditionEvaluator from "./dataConditionEvaluator";
import VariableConditionEvaluator from "./variableConditionEvaluator";
import WalletConditionEvaluator from "./walletConditionEvaluator";

export default class ConditionEvaluatorFactory {
    private json: any;
    constructor(json: any) {
        this.json = json;
    };

    public create(): ConditionEvaluator {
        const type = this.json.type?.toUpperCase();
        switch (type) {
            case "CONSTANT":
                return ConstantConditionEvaluator.fromJson(this.json);
            case "VARIABLE":
                return VariableConditionEvaluator.fromJson(this.json);
            case "CALL":
                return CallConditionEvaluator.fromJson(this.json);
            case "WALLET":
                if (process.env.ENVIROMENT === 'test')
                    return WalletConditionEvaluator.fromJson(new TestMarketDataApi(), this.json);
                return WalletConditionEvaluator.fromJson(new BinanceApi(), this.json);
            case "DATA":
                return DataConditionEvaluator.fromJson(this.json);
            default:
                throw new Error(`Unknown condition evaluator type ${type}`);
        }
    }
}