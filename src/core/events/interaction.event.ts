import { Bot } from "../bot";
import { RegisterEvent } from "../decorators/event.decorator";
import { Event } from "../enitities/event.entity";
import { Interaction } from "discord.js";
import { commandHandler } from "../handlers/command.handler";

@RegisterEvent()
export class MessageCreateEvent extends Event {
    constructor() {
        super('interactionCreate');
    }

    public async execute(interaction: Interaction) {
        if(interaction.isChatInputCommand()){
            commandHandler({
                type: "slash",
                interaction
            });
        }
    }
}