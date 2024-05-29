import { getWalletBalance } from "../../data/binanceApi";
import { MarketDataApi } from "./marketDataApi";

export default class BinanceApi implements MarketDataApi {
    async getWallet(symbol: string): Promise<number> {
        return getWalletBalance(symbol);
    }
    async buyMarket(symbol: string, amount: number) {
        
    }
    async sellMarket(symbol: string, amount: number) {
    }
}