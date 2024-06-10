import fs from 'fs'
import { MessageNotifier } from "../notifier/notificationSender";

const isTest = process.env.NODE_ENV === 'test';
const filename = isTest ? 'test.log' : 'production.log'

export function sendNotification(message: string) {
    const notifier = MessageNotifier.getInstance();
    notifier.sendNotification(message);
}

export function logToFile(message: string, type: string = "INFO") {
    const logType = type.toUpperCase();
    const date = new Date().toISOString()
    const log = `${date} - ${logType}: ${message}\n`
    fs.appendFileSync(filename, log);
}

export function logAndSendNotification(message: string, type: string = "INFO") {
    if (!isTest) {
        sendNotification(message);
    }
    logToFile(message, type);
}