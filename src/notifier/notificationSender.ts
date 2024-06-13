import  EventEmitter  from 'events';
import { Timer } from "../timer/timer";
import { timeToNotify } from "../config/notifiersConfig";

export class MessageNotifier extends EventEmitter {
    private timer: Timer;
    private static instance?: MessageNotifier;

    private constructor() {
        super();
        this.timer = new Timer(timeToNotify);
    }

    public static getInstance(): MessageNotifier {
        if (!this.instance) {
            this.instance = new MessageNotifier();
        }
        return this.instance;
    }

    public startTimer(message: string) {
        this.timer.start(() => {
            var now = new Date();
            var new_message = now.toLocaleTimeString() + " " + message;
            this.sendNotification(new_message)       
        }); 
    }

    public sendNotification(message: string) {
        this.emit('message', message);
    }
}
