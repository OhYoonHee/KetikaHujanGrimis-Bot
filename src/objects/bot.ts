import { Bot, Context } from "../extends";
import { getEnv } from "../env";
import { Modules, path } from "./module";

const commandsDir = path.resolve(__dirname, "..", "commands");
export const modules = new Modules(commandsDir); 
modules.load();

const token = getEnv("BOT_TOKEN", {
    throwIfNotExist: true
}) as string;

export const bot = new Bot(token, {
    ContextConstructor: Context
});
bot.use(async (ctx, next) => {
    new Promise(async (res) => res(await modules.middleware()(ctx, next)))
});

export default bot;