import BinanceApi from "../MarketDataApi/binanceApi";
import { Action } from "./action";
import { ActionFactoryError } from "./actionFactoryError";
import BuyMarketAction from "./buyMarketAction";
import SellMarketAction from "./sellMarketAction";
import SetVariableAction from "./setVariableAction";

export default class ActionFactory {
    private json: any;

    constructor(json: any) {
        this.json = json;
    };

    private createWithType(type: string): Action {
        switch (type) {
            case "BUY_MARKET":
                return BuyMarketAction.fromJson(new BinanceApi(), this.json);
            case "SELL_MARKET":
                return SellMarketAction.fromJson(new BinanceApi(), this.json);
            case "SET_VARIABLE":
                return SetVariableAction.fromJson(this.json);
            default:
                throw new Error(`Unknown action type ${type}`);
        }
    }

    public create(): Action {
        const type = this.json.type?.toUpperCase();
        try {
            return this.createWithType(type);
        } catch (error) {
            throw new ActionFactoryError(`Error in factory creating action: ${error}`);
        }
    }
}