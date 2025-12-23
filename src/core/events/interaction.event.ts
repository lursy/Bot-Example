import { RegisterEvent } from "../../decorators/event.decorator";
import { Event } from "../../enitities/event.entity";
import { Interaction } from "discord.js";
import { CommandHandler } from "../handlers/command.handler";
import { RaceActions } from "../actions/race.actions";
import { getUser } from "../database/functions/user";

@RegisterEvent()
export class MessageCreateEvent extends Event {
    constructor() {
        super('interactionCreate');
    }

    public async execute(interaction: Interaction) {
        if (interaction.isChatInputCommand()) {
            const handler = new CommandHandler({
                type: "slash",
                command: interaction
            });

            if (!handler.isCommand) return;

            handler.run();

            return;
        }

        if(interaction.isButton()){
            const author = await getUser({ id: interaction.user.id });

            if(!author) return;

            const customId = interaction.customId.split('-');
            console.log(customId);
            const method = customId[0];

            switch(method){
                case 'rj':
                    RaceActions.join(interaction, customId[1], author);
                    break;
                case 're':
                    RaceActions.end(interaction, customId[1], author);
                    break;
            }

            return;
        }
    }
}