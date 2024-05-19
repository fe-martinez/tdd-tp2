import { collectPairsFromRuleSet, parseRules } from './evaluator/parser';
import { connectToBinanceWebSocket, getUri } from './evaluator/binanceConnection';
import { Data, getCache, memcachedClient, saveInCache, setCache } from './evaluator/database';

process.on('SIGINT', async () => {
  console.log('Cerrando la aplicación...');
  await memcachedClient.flush(); // Limpiamos la cache antes de cerrar la aplicación
  await memcachedClient.quit();
  process.exit();
});

async function set() {
  let data: Data = {
    bestBidPrice: '60000',
    bestAskPrice: '70000',
    time: new Date().toISOString()
  };
  
  let data2: Data = {
    bestBidPrice: '5000',
    bestAskPrice: '7000',
    time: new Date().toISOString()
  };
  
  let data3: Data = {
    bestBidPrice: '300',
    bestAskPrice: '400',
    time: new Date().toISOString()
  };

  await setCache('BTC/USDT', [data], 3600);
  await setCache('BTC/USDT', [data2], 3600);
  await setCache('BTC/USDT', [data3], 3600);
  let result = await getCache('BTC/USDT');
  console.log(result);
}

async function program(data: Data[]) {
  console.log('Inicio del programa');
  await setCache('BTC/USDT', data, 3600);
  // try {
  // await getCache('BTC/USDT');
  // //await getCache('Hola');
  
  // } catch(error) {
  //   console.log("*********")
  //   console.log(error)
  //   console.log("*********")
  // }
  // console.log('Fin del programa');
  //await memcachedClient.flush();
  await memcachedClient.quit();
}

//Esto no sé por qué no funciona, es lo que debería permitirnos obtener las reglas del archivo rules.json
function getPairsFromFile(filePath: string): any {
  let ruleSet = parseRules('/home/claram97/tdd/tdd-tp2/src/evaluator/rules.json');
  console.log(ruleSet)
  let pairs = collectPairsFromRuleSet(ruleSet);
  console.log(pairs)
}

//let pairs = getPairsFromFile('/home/claram97/tdd/tdd-tp2/src/evaluator/rules.json');

let pairs = ['BTC/USDT', 'ETH/USDT', 'ADA/USDT'];

let URI = getUri(pairs);
//connectToBinanceWebSocket(URI);

//Después le pongo otro nombre pero sería lo que se va a guardar en la bdd

let data: Data = {
  bestBidPrice: '60000',
  bestAskPrice: '70000',
  time: new Date().toISOString()
};

let data2: Data = {
  bestBidPrice: '5000',
  bestAskPrice: '7000',
  time: new Date().toISOString()
};


let data_array = [data];
let data_array2 = [data2];
//program(data_array);  
set();
