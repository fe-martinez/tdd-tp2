export interface Data {
    bestBidPrice: string;
    bestAskPrice: string;
    time: Date;
}

const historicalData: { [symbol: string]: Data[] } = {};

const TO_HOUR = 1000;

function calculateDateOffset(hours: number): Date {
    const now = new Date();
    return new Date(now.getTime() - hours * TO_HOUR);
}

function filterDataByDateRange(data: Data[], sinceDate: Date, untilDate: Date): Data[] {
    return data.filter(d => d.time >= sinceDate && d.time <= untilDate);
}

export function getHistoricalData(symbol: string, since: number, until: number): Data[] {
    const sinceDate = calculateDateOffset(since);
    const untilDate = calculateDateOffset(until);
    const data = historicalData[symbol] || [];
    return filterDataByDateRange(data, sinceDate, untilDate);
}

export function getHistoricalPairValues(symbol: string, since: number, until: number): number[] {
    const parsedSymbol = symbol.replace("/", "");
    const data = getHistoricalData(parsedSymbol, since, until);
    return data.map(d => parseFloat(d.bestBidPrice));
}

export function getLastPairValue(symbol: string): number {
    const data = historicalData[symbol] || [];
    return data.length > 0 ? parseFloat(data[data.length - 1].bestBidPrice) : 0;
}

export function addHistoricalData(symbol: string, data: Data): void {
    historicalData[symbol] = [...(historicalData[symbol] || []), data];
    console.log(`Datos históricos actualizados para el símbolo ${symbol}:`, historicalData[symbol]);
    clearHistoricalData();
}

export function clearHistoricalData(): void {
    const now = new Date().getTime();
    for (const symbol in historicalData) {
        historicalData[symbol] = historicalData[symbol].filter(d => now - new Date(d.time).getTime() <= 3600000);
    }
}

export function clearAllHistoricalData(): void {
    for (const symbol in historicalData) {
        delete historicalData[symbol];
    }
    console.log('All historical data cleared');
}