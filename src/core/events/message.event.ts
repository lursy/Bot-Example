import { RegisterEvent } from "../decorators/event.decorator";
import { commandHandler } from "../handlers/command.handler";
import { Event } from "../enitities/event.entity";
import { Message } from "discord.js";
import { Bot } from "../bot";

@RegisterEvent()
export class MessageCreateEvent extends Event {
    constructor() {
        super('messageCreate');
    }

    public async execute(message: Message) {
        if(!message.guild) return;
        if(message.author.bot) return;

        if(message.content.startsWith(Bot.instance.prefix)) {
            commandHandler({
                type: "prefix",
                command: message
            });
        }
    }
}