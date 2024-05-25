export class InsufficientFundsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InsufficientFundsError';
    }
}

export interface MarketDataApi {
    getWallet: (symbol: string) => Promise<number>;
    buyMarket: (symbol: string, amount: number) => Promise<void>;
    // sellMarket: (symbol: string, amount: number) => Promise<void>;
}