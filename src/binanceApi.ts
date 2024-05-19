import axios from 'axios';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'https://testnet.binance.vision/api';
const API_KEY = process.env.BINANCE_API_KEY!;
const API_SECRET = process.env.BINANCE_API_SECRET!;

console.log('API_KEY:', API_KEY);
console.log('API_SECRET:', API_SECRET);

function getSignature(queryString: string): string {
  return crypto.createHmac('sha256', API_SECRET).update(queryString).digest('hex');
}

export async function placeOrder(symbol: string, side: 'BUY' | 'SELL', quantity: number): Promise<any> {
  const timestamp = Date.now();
  const queryString = `symbol=${symbol}&side=${side}&type=MARKET&quantity=${quantity}&timestamp=${timestamp}`;
  const signature = getSignature(queryString);

  const url = `${BASE_URL}/v3/order?${queryString}&signature=${signature}`;
  console.log(`Placing ${side} order for ${quantity} ${symbol}...`);
  try {
    const response = await axios.post(url, null, {
      headers: {
        'X-MBX-APIKEY': API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error placing order:');
    throw error;
  }
}
