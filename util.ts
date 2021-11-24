// Import package or type
import { Context } from "https://deno.land/x/grammy@v1.4.2/mod.ts";
import { CommandContext, MaybeArray, StringWithSuggestions } from "./types.ts";
import { render } from 'https://deno.land/x/mustache/mod.ts';

// Export function or class
export function toArray<C>(input: MaybeArray<C>): C[] {
    return Array.isArray(input) ? input : [input];
}

/**
 * 
 * @param {number} start 
 * @param {number} stop 
 * @param {number} step 
 * @returns {number[]} 
 * @see https://stackoverflow.com/a/8273091
 */
 export function range(start: number, stop?: number,step?: number): number[] {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
}

export class CommandUtil {
    /**
     * Checks if the given string is a valid command, and return the command name if it is.
     * @param {string} text
     * @param {string} prefix
     * @param {string} command
     * @param {string|undefined} username
     * @returns {string|undefined}
     */
    static is_right_command(
        text: string,
        prefix: string | string[],
        command: string | string[],
        username?: string,
    ): string | undefined {
        let prefixs = toArray(prefix);
        let commands = toArray(command);
        let test = /([^@\s]+)@?(?:(\S+)|)\s?([\s\S]+)?$/i.exec(text);
        for (let x of commands) {
            if (test) {
                let [_, cmd, nickname] = test;
                if (cmd.trim().length > 1) {
                    if (prefixs.includes(cmd.trim()[0])) {
                        if (cmd.trim().slice(1).toLowerCase() == x.toLowerCase()) {
                            if (nickname && username) {
                                if (nickname.trim().toLowerCase() != username.toLowerCase()) {
                                    continue;
                                }
                            }
                            return cmd.trim().slice(1).toLowerCase();
                        }
                    }
                }
            }
        }
        return undefined;
    }

    /**
     * Parses the given string as a command, and returns the command arguments.
     * @param {string} text
     * @returns {string}
     */
    static parse_arguments(text: string): string {
        let test = /([^@\s]+)@?(?:(\S+)|)\s?([\s\S]+)?$/i.exec(text);
        if (test) {
            let [_, cmd, _nickname, args] = test;
            if (cmd.trim().length > 1) {
                if (args) {
                    return args.trim();
                }
            }
        }
        return "";
    }
}

export class MessageUtil {
    static renderMessage(text: string, model?: Record<string, string | any>): string {
        return render(text, model);
    }
}

export class DevUtil {
    /**
     * Randomly generate a string of the specified length.
     * @param {number} length
     * @returns {string} Random string
     */
    static get_random_string(length: number): string {
        let result = "";
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    /**
     * Shuffle an array.
     * @param {T[]} array
     * @returns {T[]} Randomized array
     */
    static shuffle_array<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * Chunck an array into chunks of the specified size.
     * @param {T[]} array
     * @param {number} chunk_size
     * @returns {T[][]} Chunks
     */
    static chunk_array<T>(array: T[], chunk_size: number): T[][] {
        let chunks = new Array(Math.ceil(array.length / chunk_size)).fill(null).map(
            () => array.splice(0, chunk_size),
        );
        return chunks;
    }

    /**
     * Sleep for the specified number of milliseconds.
     * @param {number} ms
     * @returns {Promise<unknown>} Promise that resolves after the specified number of milliseconds.
     */
    static sleep(ms: number): Promise<unknown> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Get the current time in milliseconds.
     * @returns {number} Current time in milliseconds.
     */
    static get_time_ms(): number {
        return new Date().getTime();
    }

    /**
     * Get flags from a string
     * @param {string} input
     * @returns {{args: string; flags: string[]}} Flags and arguments
     */
    static parseFlags(input: string): { args: string; flags: string[] } {
        let args: string[] | string = [];
        let flags = [];
        for (const flag of input.split(" ")) {
            let flag_name = [flag].filter((flag) => flag.length >= 3).filter((flag) =>
                flag.startsWith("--")
            ).map((flag) => flag.substr(2).toLowerCase());
            if (flag_name.length > 0) flags.push(flag_name[0]);
            else args.push(flag);
        }
        args = args.join(" ");
        return { args, flags };
    }

    /**
     * Parse a type from a input
     * @see https://github.com/hansputera/grambot/blob/c1c467d55eee4789c8692f1649a73a93b16ab74e/src/util/dev.ts#L32
     * @param input
     * @returns {string} The type of the input
     */
    static parse_type(input: any) {
        if (input instanceof Deno.Buffer) {
            let length = Math.round(input.length / 1024 / 1024);
            let ic = "MB";
            if (!length) {
                length = Math.round(input.length / 1024);
                ic = "KB";
            }
            if (!length) {
                length = Math.round(input.length);
                ic = "Bytes";
            }
            return `Buffer (${length} ${ic})`;
        }
        return input === null || input === undefined
            ? "Void"
            : input.constructor.name;
    }

    /**
     * Escape a string from a html
     * @param {string} s
     * @returns {string} Escaped string
     */
    static escape_html(s: string) {
        return s
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    /**
     * Clean a string from a html
     * @param {string} s
     * @returns {string} Cleaned string
     */
    static clear_html(s: string): string {
        return s.replace(/<[^>]*>/g, "");
    }

    static isNumber(input: string): boolean {
        return /^\d+$/.test(input.toString());
    }
}

export class filter {
    static command<C extends Context, S extends string>(
        command: MaybeArray<
            StringWithSuggestions<S | "start" | "help">
        >,
    ) {
        return (ctx: CommandContext<C>): ctx is CommandContext<C> => {
            let right = CommandUtil.is_right_command(
                ctx.msg.text,
                ["!", ".", "-", "/"],
                command,
                ctx.me.username,
            );
            if (right) {
                ctx.match = CommandUtil.parse_arguments(ctx.msg.text);
                ctx.cmd_name = right;
            }
            return right ? true : false;
        };
    }
}
