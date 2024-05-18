import * as memjs from 'memjs';

export const memcachedClient = memjs.Client.create();

export interface Data {
    bestBidPrice: string;
    bestAskPrice: string;
}  

export async function setCache(key: string, value: Data, expires: number) {
    const serializedValue = JSON.stringify(value);
    const received  = await memcachedClient.set(key, Buffer.from(serializedValue), { expires });
    if (!received) {
        console.error('Error al establecer el valor en Memcached:');
    } else {
        console.log(`Valor establecido en Memcached: ${key} = ${serializedValue}`);
    }
}

export async function getCache(key: string) : Promise<Data> {
    const  value  = await memcachedClient.get(key);
    if (value.value != null) {
        console.log(`Valor obtenido de Memcached: ${key} = ${value.value.toString()}`);
        let data: Data = JSON.parse(value.value.toString());
        return data;
    } else {
        throw new Error(`Valor no encontrado en Memcached para la clave: ${key}`);
    }
}

export async function desconnectCache() {
    await memcachedClient.quit();
}