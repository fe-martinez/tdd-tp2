import { ConditionType } from "./conditionTypeEnum";

export type Value = number | boolean | string;

export interface ConstantCondition {
  type: ConditionType.CONSTANT;
  value: Value;
}

export interface VariableCondition {
  type: ConditionType.VARIABLE;
  name: string;
}

export interface WalletCondition {
  type: ConditionType.WALLET;
  symbol: string;
}

export interface CallCondition {
  type: ConditionType.CALL;
  name: string;
  arguments: Condition[];
}

export interface DataCondition {
  type: ConditionType.DATA;
  symbol: string;
  since: number;
  until: number;
  default?: Condition[];
}

export type Condition = ConstantCondition | VariableCondition | WalletCondition | CallCondition | DataCondition;

export interface BuyMarketAction {
  type: 'BUY_MARKET';
  symbol: string;
  amount: Condition;
}

export interface SellMarketAction {
  type: 'SELL_MARKET';
  symbol: string;
  amount: Condition;
}

export interface SetVariableAction {
  type: 'SET_VARIABLE';
  name: string;
  value: Condition;
}

export type Action = BuyMarketAction | SellMarketAction | SetVariableAction;

export interface Rule {
  name: string;
  condition: Condition;
  action: Action[];
}

export interface RuleSet {
  variables: { [name: string]: Value };
  rules: Rule[];
}