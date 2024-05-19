import fs from 'fs';
import { Condition, Rule, RuleSet, DataCondition, CallCondition, Value } from './types';
import { ConditionType } from './conditionTypeEnum';

export function parseRules(filePath: string): RuleSet {
    const rulesData = fs.readFileSync(filePath, 'utf8');
    const ruleSet: RuleSet = JSON.parse(rulesData);
    return ruleSet;
}

export function collectPairsFromRuleSet(ruleSet: RuleSet): string[] {
    const pairs: string[] = [];
    ruleSet.rules.forEach(rule => {
        const rulePairs = extractExchangePairs(rule);
        pairs.push(...rulePairs);
    });
    return pairs;
}

export function extractExchangePairs(rule: Rule): string[] {
    const pairs: string[] = [];
    traverse(rule.condition, pairs);
    return pairs;
}

export function traverse(condition: Condition, pairs: string[]) {
    if (condition.type === ConditionType.CALL) {
        handleCallCondition(condition, pairs);
    }else {
        throw new Error(`Unknown condition type: ${condition.type}`);
    }
}

export function handleCallCondition(condition: CallCondition, pairs: string[]) {
    condition.arguments.forEach(arg => {
        if (arg.type === ConditionType.DATA) {
            handleDataCondition(arg as DataCondition, pairs);
        } else {
            traverse(arg, pairs);
        }
    });
}

export function handleDataCondition(condition: DataCondition, pairs: string[]) {
    if ('symbol' in condition) {
        pairs.push(condition.symbol);
    }
}
