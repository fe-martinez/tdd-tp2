import CallConditionEvaluator from "./callConditionEvaluator";
import ConditionEvaluatorFactory from "./conditionEvaluatorFactory";
import ConstantConditionEvaluator from "./constantConditionEvaluator";
import VariableConditionEvaluator from "./variableConditionEvaluator";
import WalletCondition from "./walletCondition";

describe('conditionEvaluatorFactory', () => {
    it('should create a call condition evaluator', () => {
        const factory = new ConditionEvaluatorFactory({
            type: "CALL",
            name: "==",
            arguments: [
                {
                    type: "CONSTANT",
                    value: 1
                },
                {
                    type: "CONSTANT",
                    value: 2
                }
            ]
        }
        );
        const evaluator = factory.create();
        expect(evaluator).toBeInstanceOf(CallConditionEvaluator);
    });

    it('should create a constant condition evaluator', () => {
        const factory = new ConditionEvaluatorFactory({
            type: "CONSTANT",
            value: "Hello world"
        });
        const evaluator = factory.create();
        expect(evaluator).toBeInstanceOf(ConstantConditionEvaluator);
    });

    it('should create a variable condition evaluator', () => {
        const factory = new ConditionEvaluatorFactory({
            type: "VARIABLE",
            name: "LAST_TDD/USDT_SELL_PRICE"
        });
        const evaluator = factory.create();
        expect(evaluator).toBeInstanceOf(VariableConditionEvaluator);
    });

    it('should create a wallet condition evaluator', () => {
        const factory = new ConditionEvaluatorFactory({
            type: "WALLET",
            symbol: "BTC"
        });
        const evaluator = factory.create();
        expect(evaluator).toBeInstanceOf(WalletCondition);
    });

    it('should throw an error if the json is invalid', () => {
        const factory = new ConditionEvaluatorFactory({
            type: "INVALID"
        });
        expect(() => factory.create()).toThrow(Error);
    });
});