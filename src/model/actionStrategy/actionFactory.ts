import BinanceApi from "../MarketDataApi/binanceApi";
import { Action } from "./action";
import BuyMarketAction from "./buyMarketAction";
import SellMarketAction from "./sellMarketAction";
import SetVariableAction from "./setVariableAction";

export default class ActionFactory {
    private json: any;

    constructor(json: any) {
        this.json = json;
    };

    public create(): Action {
        const type = this.json.type?.toUpperCase();
        switch (type) {
            case 'BUY_MARKET':
                return BuyMarketAction.fromJson(new BinanceApi(), this.json);
            case 'SELL_MARKET':
                return SellMarketAction.fromJson(new BinanceApi(), this.json);
            case 'SET_VARIABLE':
                // return SetVariableAction.fromJson(this.json);
            default:
                throw new Error(`Unknown action type ${type}`);
        }
    }
}