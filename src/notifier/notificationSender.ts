import axios from "axios";
import { EmbedBuilder, WebhookClient } from "discord.js";
import { EventEmitter } from 'events';

const dcWebHookUrl = 'https://discord.com/api/webhooks/1241441022748135454/0VIYKTE0O5FSSMTV5oFbFpQdU7EOLfMSghjscvxiXeiaJjTqrIJR1hpfcGKvDm9yfz_r'
const channelId = 'C074DMY7EBX';
const slackWebHookUrl = 'https://hooks.slack.com/services/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';

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
        this.webhookClient = new WebhookClient({ url: dcWebHookUrl });
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

export class SlackNotifier {
    private notifier : MessageNotifier;

    public constructor(notifier : MessageNotifier) {
        this.notifier = notifier;
    }
  
    public start() {
        this.notifier.on('message', (message) => {
            this.sendNotification(message);
        });
    }
    
    async sendNotification(message: string) {
        try {
            const payload = {
              channel: channelId,
              text: message
            };
        
            const response = await axios.post(slackWebHookUrl, payload);
          } catch (error) {
            console.error('Error al enviar el mensaje:', error);
          }
    }
}

