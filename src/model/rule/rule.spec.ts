import SetVariableAction from "../actionStrategy/setVariableAction";
import { ConditionEvaluatorType, ConditionResultNotBooleanError } from "../conditionStrategy/conditionEvaluator";
import ConstantConditionEvaluator from "../conditionStrategy/constantConditionEvaluator";
import Rule from "./rule";

describe('Rule', () => {
    const variables = new Map<string, ConditionEvaluatorType>();

    beforeEach(() => {
        variables.clear();
        variables.set('buy', false);
    });

    it('should create an instance with a name, a condition evaluator and an action', () => {
        const name = 'Buy always';
        const conditionEvaluator = new ConstantConditionEvaluator(true);
        const action = new SetVariableAction('buy', conditionEvaluator);
        const rule = new Rule(name, conditionEvaluator, [action]);
        expect(rule).toBeInstanceOf(Rule);
    });

    it('should create an instance with a different name', () => {
        const name1 = 'Sell always';
        const name2 = 'Buy always';
        const conditionEvaluator = new ConstantConditionEvaluator(true);
        const action = new SetVariableAction('buy', conditionEvaluator);
        const rule1 = new Rule(name1, conditionEvaluator, [action]);
        const rule2 = new Rule(name2, conditionEvaluator, [action]);
        expect(rule1.getName()).toBe(name1);
        expect(rule2.getName()).toBe(name2);
    });

    it('should execute the action when the condition is true', async () => {
        const name = 'Buy always';
        const conditionEvaluator = new ConstantConditionEvaluator(true);
        const action = new SetVariableAction('buy', conditionEvaluator);
        const rule = new Rule(name, conditionEvaluator, [action]);

        expect(variables.get('buy')).toBe(false);
        await rule.evaluateConditionAndExecuteActionIfTrue(variables);
        expect(variables.get('buy')).toBe(true);
    });

    it('should not execute the action when the condition is false', async () => {
        const name = 'Buy always';
        const conditionEvaluator = new ConstantConditionEvaluator(false);
        const action = new SetVariableAction('buy', conditionEvaluator);
        const rule = new Rule(name, conditionEvaluator, [action]);

        expect(variables.get('buy')).toBe(false);
        await rule.evaluateConditionAndExecuteActionIfTrue(variables);
        expect(variables.get('buy')).toBe(false);
    });

    it('should throw an error when the condition result is not a boolean', async () => {
        const name = 'Buy always';
        const conditionEvaluator = new ConstantConditionEvaluator(1);
        const action = new SetVariableAction('buy', conditionEvaluator);
        const rule = new Rule(name, conditionEvaluator, [action]);

        expect(variables.get('buy')).toBe(false);
        await expect(rule.evaluateConditionAndExecuteActionIfTrue(variables)).rejects.toThrow(ConditionResultNotBooleanError);
        expect(variables.get('buy')).toBe(false);
    });

    it('should throw an error if json does not have "name" property', () => {
        const json = {};
        expect(() => Rule.fromJson(json)).toThrow(Error);
    });

    it('should throw an error if json does not have "conditionEvaluator" property', () => {
        const json = { name: 'Buy always' };
        expect(() => Rule.fromJson(json)).toThrow(Error);
    });

    it('should throw an error if json name is not a string', () => {
        const json = { name: 1 };
        expect(() => Rule.fromJson(json)).toThrow(Error);
    });

    it('should throw an error if json does not have "action" property', () => {
        const json = { name: 'Buy always', condition: {} };
        expect(() => Rule.fromJson(json)).toThrow(Error);
    });

    it('should throw an error if json condition evaluator is not correct', () => {
        const json = {
            name: 'Buy always',
            condition: { value: true },
            action: { name: 'buy', value: true }
        };
        expect(() => Rule.fromJson(json)).toThrow(Error);
    });

    it('should throw an error if json action is not correct', () => {
        const json = {
            name: 'Buy always',
            condition: { type: "CONSTANT", value: true },
            action: { name: 'buy', value: true }
        };
        expect(() => Rule.fromJson(json)).toThrow(Error);
    });

    it('should throw an error if json action does not have a valid condition evaluator', () => {
        const json = {
            name: 'Buy always',
            condition: { type: "CONSTANT", value: true },
            action: { type: "SET_VARIABLE", name: 'buy', value: true }
        };
        expect(() => Rule.fromJson(json)).toThrow(Error);
    });

    it('should create an instance from correct json', () => {
        const json = {
            name: 'Buy always',
            condition: { type: "CONSTANT", value: true },
            action: [{ type: "SET_VARIABLE", name: 'buy', value: { type: "CONSTANT", value: true } }]
        };
        const rule = Rule.fromJson(json);
        expect(rule).toBeInstanceOf(Rule);
    });

});
