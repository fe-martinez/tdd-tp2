import { InsufficientFundsError, MarketDataApi } from "./marketDataApi";

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
    async buyMarket(symbol: string, amount: number) {
        const [base, quote] = symbol.split('/');
        const baseAmount = await this.getWallet(base);
        const quoteAmount = await this.getWallet(quote);
        if (quoteAmount < amount) {
            return Promise.reject(new InsufficientFundsError(`Insufficient funds of ${quote} to buy market`));
        }
        // for test purposes, we don't check cotization
        this.wallet.set(base, baseAmount + amount);
        this.wallet.set(quote, quoteAmount - amount);
    }
    // async sellMarket(symbol, amount) {
    //     this.wallet[symbol] = (this.wallet[symbol] || 0) - amount;
    // }
}