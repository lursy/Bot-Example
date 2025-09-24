import { RegisterCommand } from "../../decorators/command.decorator";
import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../enitities/command.entity";
import { InfoGroup } from "./_index";

@RegisterCommand(InfoGroup)
class Ping extends Command {
    constructor() {
        super({
            cooldown: 1000,
            description: "Verificar latência de resposta",
            name: "ping",
            options: [
                {
                    name: 'unidade',
                    type: ApplicationCommandOptionType.String as number,
                    description: 'unidade de medida para tempo da latência',
                    choices: [
                        { name: 'Milissegundos', value: "ms" },
                        { name: 'Segundos', value: "s" },
                    ],
                    required: false
                }
            ]
        })
    }

    public async execute() {
        console.log("pong!");
    }
}