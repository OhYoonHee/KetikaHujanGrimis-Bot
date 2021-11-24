import { InputFile } from "https://deno.land/x/grammy@v1.4.2/mod.ts";
import { CommandContext, Middleware } from '../types.ts';
import { DevUtil } from "../util.ts";

export function JSONHandler(): Middleware<CommandContext> {
    return async (ctx) => {
        let message = JSON.stringify({...ctx.msg}, null, 2);
        let pesan = `<pre>${DevUtil.escape_html(message)}</pre>`;
        if (message.length <= 4096) {
            await ctx.reply(pesan, { reply_to_message_id: ctx.msg.message_id });
            return;
        }
        let buffer = new Blob([message]);
        let file = new InputFile(buffer.stream(), "json_output.txt");
        await ctx.replyWithDocument(file, {
            caption: `${"-".repeat(20)}\nJSON dari:\n• Message id: ${ctx.msg.message_id}\n• Chat id: ${ctx.chat.id}\n${"-".repeat(20)}`,
            reply_to_message_id: ctx.msg.message_id
        });
        return;
    }
}