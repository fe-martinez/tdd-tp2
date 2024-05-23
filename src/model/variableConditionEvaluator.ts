export default class VariableConditionEvaluator {
    private variableName: string;
    constructor(variableName: string) {
        this.variableName = variableName;
    }
    evaluate(variables: Map<string, number>) {
        return variables.get(this.variableName);
    }
}