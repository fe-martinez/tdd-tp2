import * as memjs from 'memjs';

export const memcachedClient = memjs.Client.create();

//export default memcachedClient;

export async function setCache(key: string, value: string, expires: number) {
    const received  = await memcachedClient.set(key, Buffer.from(value), { expires });
    if (!received) {
        console.error('Error al establecer el valor en Memcached:');
    } else {
        console.log(`Valor establecido en Memcached: ${key} = ${value}`);
    }
}

export async function getCache(key: string) {
    const  value  = await memcachedClient.get(key);
    if (value.value != null) {
        console.log(`Valor obtenido de Memcached: ${key} = ${value.value.toString()}`);
    } else {
        console.log(`Valor no encontrado en Memcached para la clave: ${key}`);
    }
}

export async function desconnectCache() {
    await memcachedClient.quit();
}