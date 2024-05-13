"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
function connectToBinanceWebSocket() {
    const ws = new ws_1.default('wss://stream.binance.com:9443/ws/btcusdt@trade');
    ws.on('open', () => {
        console.log('Conexión WebSocket abierta con Binance');
    });
    ws.on('message', (data) => {
        const textDecoder = new TextDecoder();
        const arrayBuffer = Uint8Array.from(data).buffer;
        const jsonString = textDecoder.decode(arrayBuffer);
        try {
            const message = JSON.parse(jsonString);
            const eventType = message.e;
            const symbol = message.s;
            const price = message.p;
            const quantity = message.q;
            console.log(`Nuevo evento ${eventType} para el símbolo ${symbol} con precio ${price} y cantidad ${quantity}`);
        }
        catch (error) {
            console.error('Error al analizar los datos JSON:', error);
        }
    });
    ws.on('error', (error) => {
        console.error('Error en la conexión WebSocket:', error);
    });
}
connectToBinanceWebSocket();
