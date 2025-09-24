import { RegisterEvent } from "../decorators/event.decorator";
import { Event } from "../enitities/event.entity";
import { Message } from "discord.js";
import { bot } from "../../main";

@RegisterEvent()
class MessageCreateEvent extends Event {
    constructor() {
        super('messageCreate');
    }

    public async execute(message: Message) {
        if(!message.guild) return;
        if(message.author.bot) return;
        if(message.content.startsWith(bot.prefix)) {
            let text = message.content.toLowerCase();
            let args = text.slice(bot.prefix.length).trim().split(/ +/g);
            let commandName = args.shift();
    
            if(!commandName) return;
    
            const command = bot.commands.get(commandName.toLowerCase());
            
            if(!command) return;
    
            command.execute();
        }
    }
}