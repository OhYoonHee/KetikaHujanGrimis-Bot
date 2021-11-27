import { util } from "../../objects";
import { CommandFunc } from "../../types";
import { render } from "mustache";

const startFunction: CommandFunc = async (ctx) => {
    const _message = `Halo <a href="tg://user?id={{ctx.from.id}}">{{ctx.from.first_name}}</a>, salam kenal saya <b>{{ctx.me.first_name}}</b>
Saya dibuat menggunakan <a href="https://www.typescriptlang.org/">TypeScript</a> dengan library <a href="https://grammy.dev">grammY</a>
Saya saat ini dalam proses pengembangan. Jika ada masalah silakan laporkan kepada team saya di @TarianaBicara

Source code dapat dilihat pada repo <a href="https://github.com/OhYoonHee/KetikaHujanGrimis-Bot">ini</a>`;
    const message = render(_message, { ctx });
    await ctx.replyText(message, { quote: true, disable_web_page_preview: true });
    return;
};

export default util.PluginUtil.createCommand({
    name: "start",
    desc: "",
    run: startFunction
});