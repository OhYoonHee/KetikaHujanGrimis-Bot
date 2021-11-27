import { bot } from "./objects";

bot.start({
    'drop_pending_updates': true,
    onStart(botInfo) {
        let botName = botInfo.first_name;
        bot.logger.info(botName + " ready!!");
        return;
    }
});