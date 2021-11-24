import { CommandContext, Middleware } from '../types.ts';

function PingHandler(): Middleware<CommandContext> {
    return async (ctx) => {
        let time_now = Date.now() / 1000;
        let tg_time_now = ctx.msg.date;
        let time = time_now - tg_time_now;
        let message = `<b>❤️Pong!!❤️</b>\n<code>${time.toFixed(3)} s</code>`;
        await ctx.reply(message, {
            reply_to_message_id: ctx.msg.message_id
        });
        return;
    }
}

export { PingHandler };