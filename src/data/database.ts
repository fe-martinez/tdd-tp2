import * as memjs from 'memjs';
import * as msgpack from '@msgpack/msgpack';
export const memcachedClient = memjs.Client.create();

export interface Data {
    bestBidPrice: string;
    bestAskPrice: string;
    //time: string;
}  

export async function setCache(key: string, value: Data, expires: number) {
    const serializedValue = msgpack.encode(value);
    const received  = await memcachedClient.set(key, Buffer.from(serializedValue), { expires });
    if (!received) {
        console.error('Error al establecer el valor en Memcached:');
    } else {
        console.log(`Valor establecido en Memcached for key: ${key}`);
    }
}

export async function getCache(key: string) : Promise<Data> {
    const  value  = await memcachedClient.get(key);
    if (value.value != null) {
        let data : Data = msgpack.decode(value.value) as Data;
        console.log('Received data is: ', data);
        return data;
    } else {
        throw new Error(`Valor no encontrado en Memcached para la clave: ${key}`);
    }
}

export async function desconnectCache() {
    await memcachedClient.quit();
}