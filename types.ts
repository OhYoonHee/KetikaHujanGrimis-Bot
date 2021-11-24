// Import type
import { Filter, Context, NextFunction, Middleware } from "https://deno.land/x/grammy@v1.4.2/mod.ts";
import * as grammyType from "https://cdn.skypack.dev/@grammyjs/types@v2.3.1?dts";

// Export type
export type { NextFunction, Middleware, grammyType };
export type StringWithSuggestions<S extends string> = (string & {}) | S;
export type MaybeArray<T> = T | T[];
export type CommandContext<C extends Context = Context> = Filter<C & { cmd_name: string }, "msg:text">;