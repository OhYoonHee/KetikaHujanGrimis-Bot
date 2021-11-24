import { DevUtil } from "../util.ts";

export const START_MESSAGE_PRIVATE = `Halo <a href="tg://user?id={{ctx.from.id}}">{{ctx.from.first_name}}</a>, salam kenal saya <b>{{ctx.me.first_name}}</b>
Saya dibuat menggunakan <a href="https://deno.land">Deno</a> dengan library <a href="https://grammy.dev">grammY</a>
Saya saat ini dalam proses pengembangan. Jika ada masalah silakan laporkan kepada team saya di @TarianaBicara

Source code dapat dilihat pada repo <a href="https://github.com/OhYoonHee/KetikaHujanGrimis-Bot">ini</a>`;

export const START_MESSAGE_GROUP = `Hai, senang bertemu anda`;

export const HELP_COMMAND = `Berikut perintah yang saya miliki:
• start -- Memulai bot
• ping -- Bermain ping pong :v
• json -- Mendapat json sebuah message (note: keperluan dev saja)

• pp ${DevUtil.escape_html("<username|chat id|balas pesan seseorang>")} -- Mendapatkan profile photo seseorang

Saya menggunakan prefix: / - . !`;

export const HELP_GROUP = "Pesan bantuan hanya tersedia diorbrolan pribadi.";