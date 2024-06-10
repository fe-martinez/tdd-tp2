import axios from "axios";
import { MessageNotifier } from "./notificationSender";
import {channelId, slackWebHookUrl } from "../config/notifiersConfig";

export class SlackNotifier {
    private notifier : MessageNotifier;

    public constructor(notifier : MessageNotifier) {
        this.notifier = notifier;
    }
  
    public listen() {
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


export function slackConfigurationExists() {
    return ((channelId != null) && (slackWebHookUrl != null));
}