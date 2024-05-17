import fs from 'fs';
import { RuleSet } from './types';

export function parseRules(filePath: string ): RuleSet {
    const rulesData = fs.readFileSync(filePath, 'utf8');
    const ruleSet: RuleSet = JSON.parse(rulesData);
    return ruleSet;
}