import { RegisterCommand } from "../../../decorators/command.decorator";
import { ApplicationCommandOptionType, EmbedBuilder, MessageFlags } from "discord.js";
import { Command } from "../../../enitities/command.entity";
import { code } from "../../../decorators/text.decorator";
import { CommandDTO } from "../../../dtos/command.dto";
import { SupportGroup } from "./_index";
import { Bot } from "../../bot";

@RegisterCommand(SupportGroup)
class Help extends Command {
    public readonly group: string;
    constructor(nameGroup: string) {
        super({
            cooldown: 1000,
            description: "Listar comandos",
            name: "help",
            options: [
                {
                    name: 'comando',
                    type: ApplicationCommandOptionType.String as number,
                    description: 'nome do comando',
                    required: false,
                }
            ]
        });

        this.group = nameGroup;
    }

    public async execute(data: CommandDTO, commandName?: string) {
        if (!commandName) {
            commandName = "help";
        }

        this.embed(data, commandName);
    }

    private async embed(data: CommandDTO, commandName: string) {
        const command = Bot.instance.commands.get(commandName);
        const user = data.type === "prefix" ? data.command.author : data.command.user;

        if (!command) {
            if (data.type === "slash") {
                return data.command.reply({
                    content: 'Parece que o comando que você está procurando não existe...',
                    flags: [MessageFlags.Ephemeral]
                });
            }

            return data.command.reply({
                content: 'Parece que o comando que você está procurando não existe...'
            });
        }

        let description = `\n- Nome: ${command.name.toUpperCase()}\n- Categoria: ${command.group}\n- Cooldown: ${command.cooldown/1000}s\n- Descrição: ${command.description}\n\n**Parâmetros**\n`

        command.options.map((option, index) => {
            const options = (option as { choices?: {name: string, value: string}[]})
            let choices = "";
            
            if(options.choices){
                options.choices.map(
                    (choice, i) => {
                        if(i === 0){
                            choices += "Opções:\n";
                        }

                        choices += `-> "${choice.value}": ${choice.name}\n`
                    }
                );
            }
            description += code(`\nNome: ${option.name}\nObrigatório: ${(option as any).required ? "Sim" : "Não"}\n${choices}\nDescrição: ${option.description}\n`, 'ascii');
        });

        description += `\n**Como usar?**\n${code(command.howToUse)}\n`

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`📝 Ficha técnica`,)
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ size: 512 }) })
            .setDescription(description)
            .setThumbnail('https://i.pinimg.com/originals/d2/85/ba/d285ba2cc51a540ad5d5e06c489ce121.gif')


        return await data.command.reply({
            embeds: [embed]
        });
    }

    private async menu() {

    }
}