import { MarketDataApi } from "./marketDataApi";

type Wallet = Map<string, number>;

export default class TestMarketDataApi implements MarketDataApi {
    private wallet: Wallet;
    constructor() {
        this.wallet = new Map<string, number>();
    }

    async setWallet(symbol: string, amount: number) { // only for testing
        this.wallet.set(symbol, amount);
    }
    
    async getWallet(symbol: string) {
        return this.wallet.get(symbol) || 0;
    }
    // async buyMarket(symbol, amount) {
    //     this.wallet[symbol] = (this.wallet[symbol] || 0) + amount;
    // }
    // async sellMarket(symbol, amount) {
    //     this.wallet[symbol] = (this.wallet[symbol] || 0) - amount;
    // }
}