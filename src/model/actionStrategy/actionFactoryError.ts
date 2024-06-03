export class ActionFactoryError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ActionFactoryError";
    }
}