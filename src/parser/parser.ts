import fs from 'fs';
import { Condition, Rule, RuleSet, DataCondition, CallCondition, Value, Action } from '../model/types'
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
    return [...new Set(pairs)];
}

export function extractExchangePairs(rule: Rule): string[] {
    const pairs: string[] = [];
    traverse(rule.condition, pairs);
    rule.action.forEach(action => {
        traverseAction(action, pairs);
    });
    return pairs;
}

// The idea of this function is only to traverse the condition and collect the pairs.
// If it will also be used to check the validity of the condition, the other types of conditions should be handled.
export function traverse(condition: Condition, pairs: string[]) {
    if (condition.type === ConditionType.CALL) {
        handleCallCondition(condition as CallCondition, pairs);
    }
}

function traverseAction(action: Action, pairs: string[]) {
    if (action.type === "BUY_MARKET" || action.type === "SELL_MARKET") {
        pairs.push(action.symbol);
        if (action.amount.type == "CALL") {
            handleCallCondition(action.amount as CallCondition, pairs);
        } else if (action.amount.type == "DATA") {
            handleDataCondition(action.amount as DataCondition, pairs);
        }
    } else if (action.type === "SET_VARIABLE") {
        if (action.value.type === "CALL") {
            handleCallCondition(action.value as CallCondition, pairs);
        } else if (action.value.type === "DATA") {
            handleDataCondition(action.value as DataCondition, pairs);
        }
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
