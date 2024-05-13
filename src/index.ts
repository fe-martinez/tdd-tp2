import WebSocket from 'ws';

function connectToBinanceWebSocket() {
  const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

  ws.on('open', () => {
    console.log('Conexión WebSocket abierta con Binance');
  });

  ws.on('message', (data: Buffer) => {
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
    } catch (error) {
      console.error('Error al analizar los datos JSON:', error);
    }
  });

  ws.on('error', (error) => {
    console.error('Error en la conexión WebSocket:', error);
  });
}

connectToBinanceWebSocket();