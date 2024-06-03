import axios from 'axios';
import * as crypto from 'crypto';

require('dotenv').config();

const BASE_URL = 'https://testnet.binance.vision/api';
const API_KEY = process.env.BINANCE_API_KEY;
const API_SECRET = process.env.BINANCE_API_SECRET;

function getSignature(queryString: string): string {
  if(!API_SECRET) throw new Error('API_SECRET is not defined');
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

async function getResponseForPlaceOrder(url : string) {
  try {
    const response = await axios.post(url, null, {
    headers: {
      'X-MBX-APIKEY': API_KEY,
    },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Error en la respuesta de Binance:', error.response.data);
    } else if (error.request) {
      console.error('Error de conexión:', error.request);
    } else {
      console.error('Error al procesar la solicitud:', error.message);
    }
    throw error;
  }
}

export async function placeOrder(symbol: string, side: 'BUY' | 'SELL', quantity: number): Promise<any> {
  symbol = symbol.replace('/', '').toUpperCase();
  const queryString = getQueryStringForPlaceOrder(symbol, side, quantity);
  const signature = getSignature(queryString);
  const url = getBinanceApiURLForPlaceOrder(queryString, signature);
  try {
    const response = await getResponseForPlaceOrder(url);
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getResponseForOrderHistory(url : string) {
  try {
    const response = await axios.get(url, {
      headers: {
        'X-MBX-APIKEY': API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
  
function getQueryStringForOrderHistory(symbol: string) : string {
  const timestamp = Date.now();
  const queryString = `symbol=${symbol}&timestamp=${timestamp}`;
  return queryString
}


function getBinanceApiURLForOrderHistory(queryString: string, signature: string) : string {
  const url = `${BASE_URL}/v3/allOrders?${queryString}&signature=${signature}`;
  return url;
}

export async function getOrderHistory(symbol: string): Promise<any> {
  const queryString = getQueryStringForOrderHistory(symbol);  
  const signature = getSignature(queryString);
  const url = getBinanceApiURLForOrderHistory(queryString, signature);
  try {
    const response = await getResponseForOrderHistory(url);
    return response
  } catch (error) {
    throw error;
  }
}

export async function getWalletBalance(asset: string): Promise<number> {
  const timestamp = Date.now();
  const queryString = `timestamp=${timestamp}`;
  const signature = getSignature(queryString);
  const url = `${BASE_URL}/v3/account?${queryString}&signature=${signature}`;
  try {
    const response = await axios.get(url, {
      headers: {
        'X-MBX-APIKEY': API_KEY,
      },
    });
    
    const balances = response.data.balances;
    const assetBalance = balances.find((balance: any) => balance.asset === asset);
    
    return assetBalance ? parseFloat(assetBalance.free) : 0;
  } catch (error) {
    throw error;
  }
}