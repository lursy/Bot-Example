import { RegisterCommand } from "../../decorators/command.decorator";
import { ApplicationCommandOptionType, MessageFlags } from "discord.js";
import { Command } from "../../enitities/command.entity";
import { InfoGroup } from "./_index";
import { CommandHandlerDTO } from "../../dtos/command.dto";

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

    public async execute(data: CommandHandlerDTO, unity: string) {
        const status = {
            0: "🟢",
            500: "🟡",
            1000: "🔴",
        }

        if (!["s", "ms"].includes(unity)) {
            unity = "ms";
        }

        if (data.type == "prefix") {
            const start = Date.now();

            const reply = await data.message.reply({
                content: "⏳ Pong!\n-# 000ms"
            });

            const end = Date.now();
            const latency = end - start;

            let latency_status = status[1000];

            if (latency < 1000) latency_status = status[500];

            if (latency < 500) latency_status = status[0];

            reply.edit({
                content: `Pong!\n-# ${latency_status} ${unity === "ms" ? latency : latency / 1000}${unity}`
            });

            return;
        }

        const start = Date.now();

        const reply = await data.interaction.deferReply({
            flags: [MessageFlags.Ephemeral]
        });

        const end = Date.now();
        const latency = end - start;

        let latency_status = status[1000];

        if (latency < 1000) latency_status = status[500];

        if (latency < 500) latency_status = status[0];

        reply.edit({
            content: `Pong!\n-# ${latency_status} ${unity === "ms" ? latency : latency / 1000}${unity}`
        });
    }
}