import axios from "axios";
import { EventEmitter } from 'events';

export class MessageNotifier extends EventEmitter {
    public constructor() {
        super();
    }
    public sendNotification(message: string) {
        this.emit('message', message);
    }
}
