import { Context } from "../extends";
import { CommandUtil } from "./util";
import { MaybeArray, StringWithSuggestions, CommandContext } from "../types";

export class filter {
    static command<C extends Context, S extends string>(
        command: MaybeArray<
            StringWithSuggestions<S | "start" | "help">
        >,
    ) {
        return (ctx: CommandContext<C>): boolean => {
            let right = CommandUtil.is_right_command(
                ctx.msg.text,
                command,
                ctx.me.username,
            );
            if (right) {
                ctx.match = CommandUtil.parse_arguments(ctx.msg.text);
                ctx.cmdName = right;
            }
            return right ? true : false;
        };
    }

    static private() {
        return (ctx: Context) => ctx.chat?.type == "private"
    }
    
}