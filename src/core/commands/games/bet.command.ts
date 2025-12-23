import { RegisterCommand } from "../../../decorators/command.decorator";
import { ApplicationCommandOptionType, MessageFlags, MessagePayload, MessageReplyOptions, User } from "discord.js";
import { Command } from "../../../enitities/command.entity";
import { GamesGroupe } from "./_index";
import { CommandDTO } from "../../../dtos/command.dto";

@RegisterCommand(GamesGroupe)
class Race extends Command {
    public readonly group: string;

    constructor(nameGroup: string) {
        super({
            cooldown: 1000,
            description: "Entre em uma corrida de emojis!",
            name: "race",
            aliases: ["battle"],
            options: [
                {
                    name: 'valor',
                    type: ApplicationCommandOptionType.Number as number,
                    description: 'Valor da aposta',
                    required: true
                },
                {
                    name: 'oponente',
                    type: ApplicationCommandOptionType.User as number,
                    description: 'Selecione seu oponente para esta batalha',
                    required: true
                }
            ]
        });

        this.group = nameGroup;
    }

    public async execute(data: CommandDTO, value: number, player: User) {
        
    }
}