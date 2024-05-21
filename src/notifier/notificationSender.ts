import { EmbedBuilder, WebhookClient } from "discord.js";

const webhookClient = new WebhookClient({ url: 'https://discord.com/api/webhooks/1241441022748135454/0VIYKTE0O5FSSMTV5oFbFpQdU7EOLfMSghjscvxiXeiaJjTqrIJR1hpfcGKvDm9yfz_r' });

const embed = new EmbedBuilder()
	.setTitle('Some Title')
	.setColor(0x00FFFF);

export function sendMessage(message: string) {
    webhookClient.send({
        content: message,
        username: 'Messirve Binance',
        avatarURL: 'https://i.imgur.com/t4lccrE.png',
        //embeds: [embed],
    });
}

export function hola() {
    
}