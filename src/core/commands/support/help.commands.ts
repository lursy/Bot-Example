import { RegisterCommand } from "../../decorators/command.decorator";
import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../enitities/command.entity";
import { SupportGroup } from "./_index";
import { CommandHandlerDTO } from "../../dtos/command.dto";

@RegisterCommand(SupportGroup)
class Help extends Command {
    constructor() {
        super({
            cooldown: 1000,
            description: "Listar comandos",
            name: "help",
            options: [
                {
                    name: 'comando',
                    type: ApplicationCommandOptionType.String as number,
                    description: 'nome do comando',
                    required: false
                }
            ]
        })
    }

    public async execute(data: CommandHandlerDTO, command: string) {
        if(data.type === "prefix"){
            
        }
    }
}