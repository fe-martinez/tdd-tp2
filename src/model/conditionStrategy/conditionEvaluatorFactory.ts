import BinanceApi from "../MarketDataApi/binanceApi";
import TestMarketDataApi from "../MarketDataApi/testMarketDataApi";
import CallConditionEvaluator from "./callConditionEvaluator";
import { ConditionEvaluator } from "./conditionEvaluator";
import { ConditionEvaluatorFactoryError } from "./conditionEvaluatorFactoryError";
import ConstantConditionEvaluator from "./constantConditionEvaluator";
import DataConditionEvaluator from "./dataConditionEvaluator";
import VariableConditionEvaluator from "./variableConditionEvaluator";
import WalletConditionEvaluator from "./walletConditionEvaluator";

export default class ConditionEvaluatorFactory {
    private json: any;
    constructor(json: any) {
        this.json = json;
    };

    private createWithType(type: string): ConditionEvaluator {
        switch (type) {
            case "CONSTANT":
                return ConstantConditionEvaluator.fromJson(this.json);
            case "VARIABLE":
                return VariableConditionEvaluator.fromJson(this.json);
            case "CALL":
                const dataArg = this.json.arguments.find((arg: any) => arg.type?.toUpperCase() === "DATA");
                if (dataArg) {
                    if (this.json.arguments.length > 1) {
                        throw new Error("CALL conditions with a DATA argument must have a single argument");
                    }
                    const functionName = this.json.name;
                    return DataConditionEvaluator.fromJson(dataArg, functionName);
                }
                return CallConditionEvaluator.fromJson(this.json);
            case "WALLET":
                if (process.env.NODE_ENV === 'test')
                    return WalletConditionEvaluator.fromJson(new TestMarketDataApi(), this.json);
                return WalletConditionEvaluator.fromJson(new BinanceApi(), this.json);
            case "DATA":
                // We shouldn't reach this point, DATA should always be wrapped in a CALL
                throw new Error(`DATA condition evaluator must be handled inside a CALL condition evaluator`);
            default:
                throw new Error(`Unknown condition evaluator type ${type}`);
        }
    }


    public create(): ConditionEvaluator {
        const type = this.json.type?.toUpperCase();
        try {
            return this.createWithType(type);
        } catch (error) {
            throw new ConditionEvaluatorFactoryError(`Error in factory creating condition evaluator: ${error}`);
        }
    }
}