import { WebhookClient } from "discord.js";
import { MessageNotifier } from "./notificationSender";

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

export function discordConfigurationExists() {
    return dcWebHookUrl != null;
}
