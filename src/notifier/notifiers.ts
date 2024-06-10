import { discordConfigurationExists, DiscordNotifier } from "./discordNotifier";
import { MessageNotifier } from "./notificationSender";
import { slackConfigurationExists, SlackNotifier } from "./slackNotifier";


export default function setupNotifiers(notifier: MessageNotifier) {
    if (discordConfigurationExists())
        new DiscordNotifier(notifier).listen();

    if (slackConfigurationExists())
        new SlackNotifier(notifier).listen();

}