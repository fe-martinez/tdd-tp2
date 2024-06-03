import { BinanceOrder, getWalletBalance, placeOrder } from "../../data/binanceApi";
import { MarketDataApi } from "./marketDataApi";

export default class BinanceApi implements MarketDataApi {
    async getWallet(symbol: string): Promise<number> {
        return getWalletBalance(symbol);
    }

    async buyMarket(symbol: string, amount: number) {
        try {
            const order: BinanceOrder = await placeOrder(symbol, 'BUY', amount);
            if (order.status === 'REJECTED') {
                throw new Error('Order was rejected');
            }
            return Promise.resolve();
        } catch (error) {
            throw error;
        }
    }

    async sellMarket(symbol: string, amount: number) {
        try {
            const order: BinanceOrder = await placeOrder(symbol, 'SELL', amount);
            if (order.status === 'REJECTED') {
                throw new Error('Order was rejected');
            }
            return Promise.resolve();
        } catch (error) {
            throw error;
        }
    }
}