import { RegisterEvent } from "../decorators/event.decorator";
import { commandHandler } from "../handlers/command.handler";
import { Event } from "../enitities/event.entity";
import { Message } from "discord.js";
import { Bot } from "../bot";

@RegisterEvent()
export class MessageCreateEvent extends Event {
    constructor() {
        super('messageUpdate');
    }

    public async execute(oldMessage: Message, newMessage: Message) {
        if(!newMessage.guild) return;
        if(newMessage.author.bot) return;
        if(oldMessage.content == newMessage.content) return;

        if(newMessage.content.startsWith(Bot.instance.prefix)) {
            commandHandler({
                type: "prefix",
                message: newMessage
            });
        }
    }
}