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

    //Acá hay que pasarle lo que se le quiere pasar cuando 
    public startTimer(message: string) {
        this.timer.start(() => {
            this.sendNotification(message)       
        }); 
    }

    public sendNotification(message: string) {
        this.emit('message', message);
        this.timer.reset(() => {});
        //Este reset si se llama desde start timer tal vez no tiene tanto sentido pero cuando se llama por ejemplo
        //porque se compró o se vendió algo sí tiene sentido jeje
    }
}
