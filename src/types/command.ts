import type { Context } from "../extends";
import type { NextFunction, Filter } from "grammy";

export type StringWithSuggestions<S extends string> = (string & {}) | S;
export type MaybeArray<T> = T | T[];
export type CommandContext<C extends Context = Context> = Filter<C & { cmdName: string }, "msg:text" | "edit:text">;
export type CommandFunc = (ctx: CommandContext, next: NextFunction) => Promise<void>;

export interface CommandInfo {
    name: StringWithSuggestions<string | "start" | "help" | "ping">;
    desc: string;
    run: CommandFunc;
    alias?: string[];
    devOnly?: boolean;
    ownerOnly?: boolean;
    privateOnly?: boolean;
    unprivateOnly?: boolean;
    groupCommand?: string;
};

export interface GroupCommandInfo {
    groupName: string;
    private?: boolean;
    commands?: CommandInfo[];
};

export interface createCommandTyping {
    info: CommandInfo;
    __name: "command";
};

export interface createGroupCommandTyping {
    info: GroupCommandInfo;
    __name: "groupCommand";
};

export type createPluginTyping = createCommandTyping | createGroupCommandTyping;