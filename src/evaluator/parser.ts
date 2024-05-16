import fs from 'fs';
import { Condition, Rule, RuleSet, DataCondition, CallCondition } from './types';
import { ConditionType } from './conditionTypeEnum';

function parseRules(filePath: string ): RuleSet {
    const rulesData = fs.readFileSync(filePath, 'utf8');
    const ruleSet: RuleSet = JSON.parse(rulesData);
    return ruleSet;
}

export function createPairRules(filePath: string): Record<string, Rule[]> {
    const ruleSet: RuleSet = parseRules(filePath);
    const pairRules: Record<string, Rule[]> = {};

    for (const rule of ruleSet.rules) {
        const pairs = extractExchangePairs(rule);
        for (const pair of pairs) {
            if (!pairRules[pair]) {
                pairRules[pair] = [];
            }
            if (!pairRules[pair].find(existingRule => existingRule.name === rule.name)) {
                pairRules[pair].push(rule);
            }
        }
    }
    return pairRules;
}

function handleCallCondition(condition: CallCondition, pairs: string[]) {
    condition.arguments.forEach(arg => {
        if (arg.type === ConditionType.DATA) {
            handleDataCondition(arg as DataCondition, pairs);
        } else {
            traverse(arg, pairs);
        }
    });
}

function handleDataCondition(condition: DataCondition, pairs: string[]) {
    if ('symbol' in condition) {
        pairs.push(condition.symbol);
    }
}

function traverse(condition: Condition, pairs: string[]) {
    if (condition.type === ConditionType.CALL) {
        handleCallCondition(condition, pairs);
    }
}

export function extractExchangePairs(rule: Rule): string[] {
    const pairs: string[] = [];
    traverse(rule.condition, pairs);
    return pairs;
}