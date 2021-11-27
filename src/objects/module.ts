import { existsSync, readdirSync, statSync } from "fs";
import * as path from "path";
import { createLogger } from "./logger";

import type {
    createCommandTyping,
    createGroupCommandTyping
} from "../types";
import { Composer } from "../extends";

export class Modules {
    public logger = createLogger("modules");
    public command: Map<string, createCommandTyping['info']> = new Map();
    public groupCommand: Map<string, createGroupCommandTyping['info']> = new Map();
    public composer = new Composer();

    constructor(private dirName: string) { }

    public clear() {
        this.command.clear();
        this.groupCommand.clear();
        return true;
    }

    public load() {
        if (!existsSync(this.dirName)) {
            throw new Error(
                `Path ${this.dirName} could not be found`
            );
        }
        if (statSync(this.dirName).isDirectory() == false) {
            throw new Error(
                `Path ${this.dirName} is not directory!`
            );
        }
        this.clear();
        const groupFolders = readdirSync(this.dirName)
        for (const groupFolder of groupFolders) {
            const pathGroupFolder = path.resolve(this.dirName, groupFolder);
            const isDic = statSync(pathGroupFolder).isDirectory();
            if (!isDic) continue;
            const configName = [path.resolve(pathGroupFolder, "__config.ts"), path.resolve(pathGroupFolder, "__config.js")];
            const _commandsFiles = readdirSync(pathGroupFolder).map(e => path.join(this.dirName, groupFolder, e));
            const configFiles = _commandsFiles.filter(e => configName.includes(e));
            const cmndsFiles = _commandsFiles.filter(e => !configFiles.includes(e));
            const configFile = configFiles.shift();
            if (configFile == undefined || require(configFile).config == undefined || require(configFile).config.__name != "groupCommand") {
                throw new Error(groupFolder +
                    ' couldn\'t found the group command configuration!');
            }
            const config: createGroupCommandTyping = require(configFile).config;
            config.info.commands = [];
            this.logger.info("Load commands from folder " + groupFolder);
            for (const cmdFile of cmndsFiles) {
                this.logger.info("Load command from " + cmdFile);
                const command: createCommandTyping = require(cmdFile).default;
                if (command == undefined || command.__name != "command") {
                    this.logger.error("Couldn't get command from " + cmdFile);
                    continue;
                }
                command.info.groupCommand = config.info.groupName;
                config.info.commands.push(command.info);
                this.command.set(command.info.name, command.info);
                this.composer.filterFromCommandInfo(command.info, command.info.run);
                this.logger.info(cmdFile +
                    ' loaded correctly with name: ' +
                    command.info.name
                );
            }
            this.groupCommand.set(config.info.groupName, config.info);
            this.logger.info(groupFolder + ' loaded correctly with ' +
                config.info.commands.length + ' commands');
        }
    }

    public middleware() {
        return this.composer.middleware();
    }
}

export { path };