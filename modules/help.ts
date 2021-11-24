import { CommandContext, Middleware } from '../types.ts';
import { HELP_COMMAND, HELP_GROUP } from "../assets/message.ts";
import { InlineKeyboard } from "https://deno.land/x/grammy@v1.4.2/mod.ts";

export function HelpHandler(): Middleware<CommandContext> {
    return async (ctx, next) => {
        let message: string;
        let reply_markup = new InlineKeyboard();
        if (ctx.chat.type == "private") {
            message = HELP_COMMAND;
            reply_markup.text("🗑", "delete");
        } else {
            message = HELP_GROUP;
            reply_markup.url("Obrolan pribadi", `https://t.me/${ctx.me.username}`);
        }
        await ctx.reply(message, {
            reply_to_message_id: ctx.msg.message_id,
            reply_markup
        });
        return;
    }
}