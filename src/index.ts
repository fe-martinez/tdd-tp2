import { collectPairsFromRuleSet, parseRules } from './evaluator/parser';
import { connectToBinanceWebSocket, getUri } from './evaluator/binanceConnection';
import { getCache, memcachedClient, setCache } from './evaluator/database';

process.on('SIGINT', async () => {
  console.log('Cerrando la aplicación...');
  memcachedClient.quit();
  process.exit();
});

async function program() {
  console.log('Inicio del programa');
  await setCache('BTC/USDT', '60000', 1000);
  await getCache('BTC/USDT');
  await getCache('Hola');
  console.log('Fin del programa');
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

program();  
