import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { load as ymlLoad } from "js-yaml";

const path = join(__dirname, "..", "config.yml")
const isExist = existsSync(path);

if (!isExist) throw new Error("Set the config.ini file!!");

export const config = ymlLoad(readFileSync(path, "utf-8")) as any;

config.command ??= {};
config.owner ??= {};
config.dev ??= {};

config.owner.id ??= 123;
config.command.prefixes ??= ["/", "!"];

export default config;
