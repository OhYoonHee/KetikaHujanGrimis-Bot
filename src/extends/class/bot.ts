import { Api, Bot as _Bot, RawApi, BotConfig, Middleware } from "grammy";
import { autoRetry } from "@grammyjs/auto-retry";
import { 
    StringWithSuggestions, 
    MaybeArray, 
    CommandContext,
    CommandInfo 
} from "../../types";
import { toArray } from "../../objects/util";
import { filter } from "../../objects";
import { config } from "../../config";
import { createLogger } from "../../objects/logger";

import type { Context } from "./context";

export class Bot<C extends Context = Context, A extends Api<RawApi> = Api<RawApi>> extends _Bot<C, A> {
    public logger = createLogger("bot");
    constructor(token: string, config?: BotConfig<C> & { logLevel?: string }) {
        super(token, config);
        this.logger.level = config?.logLevel || "info";
        this.api.config.use(autoRetry());
        this.api.config.use(async (prev, method, payload, signal) => {
            if (payload != undefined || false) {
                if ((payload as any)['parse_mode'] == undefined) (payload as any)['parse_mode'] = "HTML";
                if ((payload as any)['parse_mode'] == false) (payload as any)['parse_mode'] = undefined;
                if ((payload as any)['allow_sending_without_reply'] == undefined) (payload as any)['allow_sending_without_reply'] = true;
            }
            return await prev(method, payload, signal);
        });
    }

    cmd<S extends string>(
        command: MaybeArray<StringWithSuggestions<S | "start" | "help">>,
        ...middleware: Array<Middleware<CommandContext<C>>>
    ) {
        return this.on(["msg:text", "edit:text"]).filter((ctx): ctx is CommandContext<C> => {
            return filter.command(toArray(command))(<CommandContext<C>>ctx);
        }, ...middleware);
    }

    filterFromCommandInfo(info: CommandInfo, ...middleware: Array<Middleware<CommandContext<C>>>) {
        const cmds = info.alias || [];
        cmds.unshift(info.name);
        const devs: number[] = config.dev.ids || [];
        const ownerId = config.owner.id;
        this.cmd(cmds, async (ctx, next) => {
            if (info.devOnly && !devs.includes(ctx.from?.id as number)) return;
            if (info.ownerOnly && ctx.from?.id != ownerId) return;
            if (info.privateOnly && ctx.chat.type != "private") return;
            if (info.unprivateOnly && ctx.chat.type == "private") return;
        return await next();
        }, ...middleware);
    }
}