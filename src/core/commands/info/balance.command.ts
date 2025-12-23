import { ApplicationCommandOptionType, MessageFlags, MessagePayload, MessageReplyOptions, User } from "discord.js";
import { RegisterCommand } from "../../../decorators/command.decorator";
import { Command } from "../../../enitities/command.entity";
import { CommandDTO } from "../../../dtos/command.dto";
import { InfoGroup } from "./_index";
import { findUser } from "../../../discord/functions/find-user.discord";
import { Bot } from "../../bot";
import { getUser } from "../../database/functions/user";

@RegisterCommand(InfoGroup)
export class Balance extends Command {
    public readonly group: string;

    constructor(nameGroup: string) {
        super({
            cooldown: 1000,
            description: "exibe a quantidade de magias na sua conta",
            name: "balance",
            aliases: ["bal", "tm", "atm"],
            options: [
                {
                    name: 'membro',
                    type: ApplicationCommandOptionType.User as number,
                    description: 'mencione o membro que deseja buscar o saldo',
                    required: false
                }
            ]
        });

        this.group = nameGroup;
    }

    public async execute(data: CommandDTO, mention?: string | User) {
        if(!mention){
            data.command.reply(`${Bot.settings.emojis.atena_money} **|** <@${data.user._id}> possui ${data.user.money.toLocaleString('de-DE')} ${Bot.settings.money}`)
            return;
        }
        
        if(!(mention instanceof User)){
            const response = await findUser(mention, data.command.guild ?? undefined);

            if(!response) {
                data.command.reply(`${Bot.settings.emojis.error} **|** Usuário não encontrado`);
                return;
            }

            mention = response;
        }

        const user = await getUser({id: mention.id});

        if(user){
            data.command.reply(`${Bot.settings.emojis.atena_money} **|** <@${user._id}> possui ${user.money.toLocaleString('de-DE')} ${Bot.settings.money}`)
        }
    }
}