import { RegisterCommand } from "../../../decorators/command.decorator";
import { ApplicationCommandOptionType, EmbedBuilder, MessageFlags } from "discord.js";
import { Command } from "../../../enitities/command.entity";
import { code } from "../../../decorators/text.decorator";
import { CommandDTO } from "../../../dtos/command.dto";
import { SupportGroup } from "./_index";
import { Bot } from "../../bot";
import { findUser } from "../../../discord/functions/find-user.discord";

@RegisterCommand(SupportGroup)
class Find extends Command {
    public readonly group: string;
    constructor(nameGroup: string) {
        super({
            cooldown: 1000,
            description: "log usuário",
            name: "find",
            options: [
                {
                    name: 'usuário',
                    type: ApplicationCommandOptionType.User as number,
                    description: 'Mencione o usuário',
                    required: true,
                }
            ]
        });

        this.group = nameGroup;
    }

    public async execute(data: CommandDTO, mention?: string) {
        if (!mention) {
            return;
        }

        this.profile(data, mention);
    }

    private async profile(data: CommandDTO, mention: string) {
        const user = await findUser(mention);

        console.log(user);
    }
}