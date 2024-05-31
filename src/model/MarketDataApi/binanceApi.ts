import { getWalletBalance, placeOrder } from "../../data/binanceApi";
import { MarketDataApi } from "./marketDataApi";

export default class BinanceApi implements MarketDataApi {
    async getWallet(symbol: string): Promise<number> {
        return getWalletBalance(symbol);
    }
    async buyMarket(symbol: string, amount: number) {
        return placeOrder(symbol, 'BUY', amount);
    }
    async sellMarket(symbol: string, amount: number) {
        return placeOrder(symbol, 'SELL', amount);
    }
}