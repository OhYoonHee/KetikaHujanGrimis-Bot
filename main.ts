// Import package or type
import { env } from "./env.ts";
import { Bot, Composer } from "./class.ts";
import * as handler from "./modules/mod.ts";
import { Api, Context } from "https://deno.land/x/grammy@v1.4.2/mod.ts";

// Create bot
const bot = new Bot<Context & { cmd_name?: string; }, Api>(env.BOT_TOKEN, {
    client: {
        apiRoot: env.LOCAL_API_URL || "https://telegram.rest",
        buildUrl(root, token, method) {
            return `${root}/bot${token}/${method}`
        }
    }
});

// register commands
const commands = new Composer();
commands.cmd("start", handler.StartHandler());
commands.cmd("help", handler.HelpHandler());
commands.cmd("ping", handler.PingHandler());
commands.cmd("json", handler.JSONHandler());
commands.cmd("pp", handler.PPHandler());

// Add middleware to bot
bot.use(async (ctx, next) => {
    new Promise(async (res) => res(await commands.middleware()(ctx, next)));
});
bot.callbackQuery("delete", async (ctx) => {
    await ctx.deleteMessage();
    return;
});

// Start bot
bot.start({
    drop_pending_updates: true,
    onStart(botInfo) {
        console.info(botInfo.first_name, "ready!!");
    }
});