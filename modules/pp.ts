import { CommandContext, Middleware } from '../types.ts';
import { DevUtil, range } from "../util.ts";

export function PPHandler(): Middleware<CommandContext> {
    return async (ctx) => {
        let args: string | undefined = ctx.match == "" ? undefined : ctx.match as string;
        let chat_id: string | number = ctx.from?.id as number;
        if (ctx.msg.reply_to_message) {
            chat_id = ctx.msg.reply_to_message.from?.id as number;
        }
        if (args) {
            if (DevUtil.isNumber(args)) {
                chat_id = args;
            } else {
                chat_id = args.startsWith("@") ? args : `@${args}`;
            }
        };
        try {
            let getpp = async (chat_id: string | number) => {
                try {
                    let chat = DevUtil.isNumber(chat_id as string) ? { id: Number(chat_id) } : await ctx.api.getChat(chat_id)
                    return { user_id: chat.id, ...(await ctx.api.getUserProfilePhotos(chat.id)) };
                } catch (e) {
                    return { photos: [], total_count: 0, user_id: chat_id, }
                }
            };
            let { photos, total_count, user_id } = await getpp(chat_id);
            if (total_count < 1) {
                await ctx.reply("Tidak ada profile photo ditemukan :)", {
                    reply_to_message_id: ctx.msg.message_id
                });
                return;
            }
            let rang = DevUtil.chunk_array(range(0, total_count - 1), 10);
            let waiting = await ctx.reply("Mengambil photo profile...", {
                reply_to_message_id: ctx.msg.message_id
            });
            for (let x of rang) {
                let images = x.map(y => photos[y][photos[y].length - 1]).map(e => ({
                    type: "photo" as "photo",
                    media: e.file_id,
                    caption: `Photo profile milik ${user_id}, didapatkan melalui @${ctx.me.username}`
                }));
                await ctx.replyWithMediaGroup(images, { reply_to_message_id: ctx.msg.message_id });
            }
            await ctx.api.deleteMessage(waiting.chat.id, waiting.message_id);
            await ctx.reply("Seluruh profile photo berhasil diambil", {
                reply_to_message_id: ctx.msg.message_id
            });
            return;
        } catch (e) {
            console.log(e);
            await ctx.reply("Telah terjadi kesalahan selama proses berlangsung\nSilakan laporkan ke @TarianaBicara", {
                reply_to_message_id: ctx.msg.message_id
            });
            return;
        }
    };
};