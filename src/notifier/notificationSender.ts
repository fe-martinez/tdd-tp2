import { EmbedBuilder, WebhookClient } from "discord.js";
import { EventEmitter } from 'events';

const webHookUrl = 'https://discord.com/api/webhooks/1241441022748135454/0VIYKTE0O5FSSMTV5oFbFpQdU7EOLfMSghjscvxiXeiaJjTqrIJR1hpfcGKvDm9yfz_r'

export class MessageNotifier extends EventEmitter {
    public constructor() {
        super();
    }
    public sendNotification(message: string) {
        this.emit('message', message);
    }
}

export class DiscordNotifier {
    private webhookClient: WebhookClient;
    private notifier : MessageNotifier;

    public constructor(notifier : MessageNotifier) {
        this.webhookClient = new WebhookClient({ url: webHookUrl });
        this.notifier = notifier;
    }
  
    public start() {
        this.notifier.on('message', (message) => {
            this.sendNotification(message);
        });
    }
    
    sendNotification(message: string) {
        this.webhookClient.send({
            content: message,
            username: 'Messirve Binance',
            avatarURL: 'https://i.imgur.com/t4lccrE.png',
        });
    }
}
