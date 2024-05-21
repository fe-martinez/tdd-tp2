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

function getQueryStringForPlaceOrder(symbol: string, side: 'BUY' | 'SELL', quantity: number) : string {
  const timestamp = Date.now();
  const queryString = `symbol=${symbol}&side=${side}&type=MARKET&quantity=${quantity}&timestamp=${timestamp}`;
  return queryString
}

function getBinanceApiURLForPlaceOrder(queryString: string, signature: string) : string {
  const url = `${BASE_URL}/v3/order?${queryString}&signature=${signature}`;
  return url;
}

async function getResponse(url : string) {
  try {
    const response = await axios.post(url, null, {
    headers: {
      'X-MBX-APIKEY': API_KEY,
    },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function placeOrder(symbol: string, side: 'BUY' | 'SELL', quantity: number): Promise<any> {
  const queryString = getQueryStringForPlaceOrder(symbol, side, quantity);
  const signature = getSignature(queryString);
  const url = getBinanceApiURLForPlaceOrder(queryString, signature); 
  try {
    const response = await getResponse(url);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getOrderHistory(symbol: string): Promise<any> {
    const timestamp = Date.now();
    const queryString = `symbol=${symbol}&timestamp=${timestamp}`;
    const signature = getSignature(queryString);
  
    const url = `${BASE_URL}/v3/allOrders?${queryString}&signature=${signature}`;
    try {
      const response = await axios.get(url, {
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

  
// function getQueryStringForOrderHistory(symbol: string) : string {
//   const timestamp = Date.now();
//   const queryString = `symbol=${symbol}&timestamp=${timestamp}`;
//   return queryString
// }


// function getBinanceApiURLForOrderHistory(queryString: string, signature: string) : string {
//   const url = `${BASE_URL}/v3/allOrders?${queryString}&signature=${signature}`;
//   return url;
// }

// export async function getOrderHistory(symbol: string): Promise<any> {
//   const queryString = getQueryStringForOrderHistory(symbol);  
//   const signature = getSignature(queryString);
//   const url = getBinanceApiURLForOrderHistory(queryString, signature);
//   try {
//     const response = await getResponse(url);
//     return response
//   } catch (error) {
//     throw error;
//   }
// }
  
  