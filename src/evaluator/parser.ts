import fs from 'fs';
import { Condition, Rule, RuleSet, DataCondition, CallCondition, Value } from '../model/types'
import { ConditionType } from '../model/conditionTypeEnum';

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

// The idea of this function is only to traverse the condition and collect the pairs.
// If it will also be used to check the validity of the condition, the other types of conditions should be handled.
export function traverse(condition: Condition, pairs: string[]) {
    if (condition.type === ConditionType.CALL) {
        handleCallCondition(condition as CallCondition, pairs);
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
