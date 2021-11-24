import { filter, toArray } from "./util.ts";
import {
    MaybeArray,
    StringWithSuggestions,
    CommandContext
} from './types.ts';
import {
    Bot as GrammyBot,
    Composer as ComposerGrammy,
    Context,
    RawApi,
    Api,
    Middleware,
    BotConfig
} from "https://deno.land/x/grammy@v1.4.2/mod.ts";
import { autoRetry } from "https://cdn.skypack.dev/@grammyjs/auto-retry";
import { limit } from "https://deno.land/x/grammy_ratelimiter@v1.1.4/rateLimiter.ts";

export class Bot<C extends Context, A extends Api<RawApi>> extends GrammyBot<C, A> {
    constructor(token: string, config?: BotConfig<C>) {
        super(token, config);
        this.api.config.use(autoRetry());
        this.use(limit({
            timeFrame: 1000 * 10,
            limit: 5
        }));
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
        //@ts-ignore
        return this.on(["msg:text", "edit:text"]).filter((ctx) => {
            //@ts-ignore
            return filter.command(toArray(command))(ctx);
        }, ...middleware);
    }
}

export class Composer<C extends Context = Context> extends ComposerGrammy<C> {
    cmd<S extends string>(command: MaybeArray<StringWithSuggestions<S | "start" | "help">>, ...middleware: Array<Middleware<CommandContext<C>>>) {
        //@ts-ignore
        return this.on(["msg:text", "edit:text"]).filter((ctx) => {
            //@ts-ignore
            return filter.command(toArray(command))(ctx);
        }, ...middleware);
    }
}