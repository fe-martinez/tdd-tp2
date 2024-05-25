export interface MarketDataApi {
    getWallet: (symbol: string) => Promise<number>;
    // buyMarket: (symbol: string, amount: number) => Promise<void>;
    // sellMarket: (symbol: string, amount: number) => Promise<void>;
}