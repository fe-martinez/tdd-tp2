import { Value } from "../model/types";

export interface Data {
    bestBidPrice: string;
    bestAskPrice: string;
    time: Date;
}  

const historicalData: { [symbol: string]: Data[] } = {};

export function getHistoricalData(symbol: string, since: number, until: number): Data[] {
    const data = historicalData[symbol] || [];
    return data;
}

export function getHistoricalPairValues(symbol: string, since: number, until: number): Value[] {
    const data = getHistoricalData(symbol, since, until);
    return data.map(d => (d.bestBidPrice));
}

export function getLastPairValue(symbol: string): number {
    const data = historicalData[symbol] || [];
    return data.length > 0 ? parseFloat(data[data.length - 1].bestBidPrice) : 0;
}

export function addHistoricalData(symbol: string, data: Data): void {
    historicalData[symbol] = [...(historicalData[symbol] || []), data];
    console.log(historicalData[symbol].length)
    // clearHistoricalData();
}

export function clearHistoricalData(): void {
    const now = new Date().getTime();
    for (const symbol in historicalData) {
        historicalData[symbol] = historicalData[symbol].filter(d => now - new Date(d.time).getTime() <= 3600000);
    }
}

export function getData(symbol: string, since: number, until: number): Data[] {
    return getHistoricalData(symbol, since, until);
}