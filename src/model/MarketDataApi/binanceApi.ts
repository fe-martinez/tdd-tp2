import { MarketDataApi } from "./marketDataApi";

export class BinanceApi implements MarketDataApi {
    async getWallet(symbol: string) {
        return 0
    }
    async buyMarket(symbol: string, amount: number) {
    }
    async sellMarket(symbol: string, amount: number) {
    }
}