import fs from 'fs'
const filename = process.env.NODE_ENV === 'development' ? 'development.log' : 'production.log'

export default function(message: string, type: string = "INFO") {
    const logType = type.toUpperCase();
    const date = new Date().toISOString()
    const log = `${date} - ${logType}: ${message}\n`
    fs.appendFileSync(filename, log);
}