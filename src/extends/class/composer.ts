import { Composer as _Composer, Middleware } from "grammy";
import { 
    StringWithSuggestions, 
    MaybeArray, 
    CommandContext,
    CommandInfo 
} from "../../types";
import { toArray } from "../../objects/util";
import { filter } from "../../objects";
import { config } from "../../config";


import type { Context } from "./context";

export class Composer<C extends Context = Context> extends _Composer<C> {

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
        return this.cmd(cmds, async (ctx, next) => {
            if (info.devOnly && !devs.includes(ctx.from?.id as number)) return;
            if (info.ownerOnly && ctx.from?.id != ownerId) return;
            if (info.privateOnly && ctx.chat.type != "private") return;
            if (info.unprivateOnly && ctx.chat.type == "private") return;
            return await next();
        }, ...middleware);
    }
}