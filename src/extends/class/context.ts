import { Context as _Context, Api, RawApi, InputFile } from 'grammy';
import { Update, UserFromGetMe, Message } from '@grammyjs/types';
import { Other } from 'grammy/out/core/api';
import { config } from "../../config";
import type { OwnerInfoTyping } from "../../types";
import type { Bot } from "./bot";
import { toArray } from '../../objects/util';

export class Context extends _Context {
    public args: string | undefined;
    public cmdName: string | undefined;
    constructor(update: Update, api: Api<RawApi>, me: UserFromGetMe) {
        super(update, api, me);
        this.api.config.use(async (prev, method, payload, signal) => {
            if( payload != undefined || false ) {
                if((payload as any)['parse_mode'] == undefined) (payload as any)['parse_mode'] = "HTML";
                if((payload as any)['parse_mode'] == false) (payload as any)['parse_mode'] = undefined;
            }
            if((payload as any)['allow_sending_without_reply'] == undefined) (payload as any)['allow_sending_without_reply'] = true;

            return await prev(method, payload, signal);
        });
    }

    replyText(text: string, other?: Other<RawApi, "sendMessage", "text"> & { quote?: boolean }, signal?: any | undefined): Promise<Message.TextMessage> {
        if (other) {
            if (other.quote) {
                other.reply_to_message_id = this.msg?.message_id;
            }
        }
        return this.reply(text, other, signal);
    }

    replyPhoto(photo: string|InputFile, other?: Other<RawApi, "sendMessage", "text"> & { quote?: boolean }, signal?: any | undefined): Promise<Message.PhotoMessage> {
        if (other) {
            if (other.quote) {
                other.reply_to_message_id = this.msg?.message_id;
            }
        }
        return this.replyWithPhoto(photo, other, signal);
    }

    replyVideo(video: string|InputFile, other?: Other<RawApi, "sendMessage", "text"> & { quote?: boolean }, signal?: any | undefined): Promise<Message.VideoMessage> {
        if (other) {
            if (other.quote) {
                other.reply_to_message_id = this.msg?.message_id;
            }
        }
        return this.replyWithVideo(video, other, signal);
    }

    replyAudio(audio: string|InputFile, other?: Other<RawApi, "sendMessage", "text"> & { quote?: boolean }, signal?: any | undefined): Promise<Message.AudioMessage> {
        if (other) {
            if (other.quote) {
                other.reply_to_message_id = this.msg?.message_id;
            }
        }
        return this.replyWithAudio(audio, other, signal);
    }

    replyDocument(document: string|InputFile, other?: Other<RawApi, "sendMessage", "text"> & { quote?: boolean }, signal?: any | undefined): Promise<Message.DocumentMessage> {
        if (other) {
            if (other.quote) {
                other.reply_to_message_id = this.msg?.message_id;
            }
        }
        return this.replyWithDocument(document, other, signal);
    }

    getFileLink(file_id: string, bot: Bot): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const path = await this.api.getFile(file_id);
                const config = bot['clientConfig']['client'];
                const api_url = config.apiRoot ?? "https://api.telegram.org";
                resolve(`${api_url}/file/bot${bot.token}/${path.file_path as string}`);
            } catch(e) {
                reject(e);
            }
        });
    }

    getOwnerInfo(): OwnerInfoTyping {
        return config.owner || {
            id: 123
        }
    }

    getDevIds(): number[] {
        return toArray(config.dev.ids).filter(e => typeof e == "number");
    }
}