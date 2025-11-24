import { RegisterCommand } from "../../../decorators/command.decorator";
import { ApplicationCommandOptionType, MessageFlags, MessagePayload, MessageReplyOptions } from "discord.js";
import { Command } from "../../../enitities/command.entity";
import { InfoGroup } from "./_index";
import { CommandDTO } from "../../../dtos/command.dto";

@RegisterCommand(InfoGroup)
class Ping extends Command {
    public readonly group: string;

    constructor(nameGroup: string) {
        super({
            cooldown: 1000,
            description: "Calcular tempo de resposta do bot",
            name: "ping",
            aliases: ["latency"],
            options: [
                {
                    name: 'unidade',
                    type: ApplicationCommandOptionType.String as number,
                    description: 'unidade de medida para tempo da latência',
                    choices: [
                        { name: 'milissegundos', value: "ms" },
                        { name: 'segundos', value: "s" },
                    ],
                    required: false
                }
            ]
        });

        this.group = nameGroup;
    }

    public async execute(data: CommandDTO, unity: string) {
        const status = {
            0: "🟢",
            500: "🟡",
            1000: "🔴",
        }

        if (!["s", "ms"].includes(unity)) {
            unity = "s";
        }
        
        const start = Date.now();

        const reply = await this.pongReply(data, {
            content: `Pong!\n-# ⏳ ${unity === "s" ? "0." : ""}000${unity}`
        });

        const end = Date.now();
        const latency = end - start;

        let latency_status = status[1000];

        if (latency < 1000) latency_status = status[500];
        if (latency < 500) latency_status = status[0];

        reply.edit({
            content: `Pong!\n-# ${latency_status} ${unity === "ms" ? latency : (latency / 1000).toFixed(3)}${unity}`
        });
    }

    private async pongReply(data: CommandDTO, message: string | MessagePayload | MessageReplyOptions){
        if(data.type === "prefix"){
            return await data.command.reply(message);
        }

        return await data.command.deferReply({
            flags: [MessageFlags.Ephemeral]
        });
    }
}