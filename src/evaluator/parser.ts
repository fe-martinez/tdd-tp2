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

function traverse(condition: Condition, pairs: string[]) {
    if (condition.type === ConditionType.CALL) {
        handleCallCondition(condition as CallCondition, pairs);
    }
}

function handleArgument(argument: Condition, pairs: string[]): void {
    if (isDataCondition(argument)) {
        handleDataCondition(argument as DataCondition, pairs);
    } else {
        traverse(argument, pairs);
    }
}

function isDataCondition(argument: Condition): argument is DataCondition {
    return argument.type === ConditionType.DATA;
}

function handleCallCondition(condition: CallCondition, pairs: string[]) {
    console.log("Condition arguments:", JSON.stringify(condition.arguments, null, 2));
    
    if (Array.isArray(condition.arguments)) {
        condition.arguments.forEach(arg => {
            handleArgument(arg, pairs);
        });
    } else {
        const arg = condition.arguments as Condition;
        handleArgument(arg, pairs);
    }
}

function handleDataCondition(condition: DataCondition, pairs: string[]) {
    if ('symbol' in condition) {
        pairs.push(condition.symbol);
    }
}
