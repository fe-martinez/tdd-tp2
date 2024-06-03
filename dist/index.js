"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./parser/parser");
const binanceConnection_1 = require("./data/binanceConnection");
const notificationSender_1 = require("./notifier/notificationSender");
const rulesEvaluator_1 = __importDefault(require("./model/ruleEvaluator/rulesEvaluator"));
const fs_1 = require("fs");
const binanceApi_1 = require("./data/binanceApi");
let ruleSet = (0, parser_1.parseRules)('src/rules.json');
let pairs = (0, parser_1.collectPairsFromRuleSet)(ruleSet);
const notifier = new notificationSender_1.MessageNotifier();
const discordNotifier = new notificationSender_1.DiscordNotifier(notifier);
discordNotifier.start();
const slackNotifier = new notificationSender_1.SlackNotifier(notifier);
slackNotifier.start();
const binanceData = new binanceConnection_1.BinanceListener(pairs);
binanceData.on('error', (error) => {
    console.error('WebSocket error:', error);
});
binanceData.on('connected', () => {
    console.log('WebSocket connected');
});
binanceData.on('disconnected', ({ code, reason }) => {
    console.log(`WebSocket disconnected (${code}): ${reason}`);
});
const rulesData = (0, fs_1.readFileSync)('src/rules.json', 'utf8');
const rulesJson = JSON.parse(rulesData);
const rulesEvaluator = rulesEvaluator_1.default.fromJson(rulesJson);
binanceData.on('update', () => {
    rulesEvaluator.evaluateRules();
    console.log('WebSocket update');
});
//Para probar que la wallet siga funcionando
async function order() {
    try {
        var order = await (0, binanceApi_1.placeOrder)('BTCUSDT', 'BUY', 0.001);
        console.log(order);
    }
    catch (error) {
        //console.error('Error al enviar la orden:', error);
    }
}
order();
