import { CommandContext, Middleware } from '../types.ts';
import { START_MESSAGE_PRIVATE, START_MESSAGE_GROUP } from "../assets/message.ts";
import { MessageUtil } from "../util.ts";

export function StartHandler(): Middleware<CommandContext> {
    return async (ctx, next) => {
        let message: string;
        if (ctx.chat.type == "private") {
            message = MessageUtil.renderMessage(START_MESSAGE_PRIVATE, { ctx });
        } else {
            message = MessageUtil.renderMessage(START_MESSAGE_GROUP);
        }
        await ctx.reply(message, {
            disable_web_page_preview: true,
            reply_to_message_id: ctx.msg.message_id
        });
        return
    }
}