import { RegisterCommand } from "../../../decorators/command.decorator";
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ContainerBuilder, MessageFlags, SectionBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextDisplayBuilder, ThumbnailBuilder } from "discord.js";
import { Command } from "../../../enitities/command.entity";
import { code } from "../../../decorators/text.decorator";
import { CommandDTO } from "../../../dtos/command.dto";
import { InfoGroup } from "./_index";
import { Bot } from "../../bot";

@RegisterCommand(InfoGroup)
class Help extends Command {
    public readonly group: string;
    constructor(nameGroup: string) {
        super({
            cooldown: 1000,
            description: "Informação sobre determinado comando",
            name: "help",
            aliases: ["h"],
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

        const template = this.template(commandName);

        data.command.reply(template);
    }

    private template(commandName: string): {
        components?: (ContainerBuilder | ActionRowBuilder<StringSelectMenuBuilder>)[];
        content?: string;
        flags?: number;
    } {
        const command = Bot.instance.commands.get(commandName);
    
        if (!command) {
            return {
                content: 'Parece que o comando que você está procurando não existe...',
                flags: MessageFlags.Ephemeral
            };
        }
    
        let description = `\n- Nome: ${command.name.toUpperCase()}\n- Categoria: ${command.group}\n- Cooldown: ${command.cooldown/1000}s\n- Descrição: ${command.description}\n`
    
        const components: (ContainerBuilder | ActionRowBuilder<StringSelectMenuBuilder>)[] = [
            new ContainerBuilder()
            .setAccentColor(0x0099FF)
            .addSectionComponents(
                new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`# 📝 Ficha técnica\n${description}`),
                )
                .setThumbnailAccessory(
                    new ThumbnailBuilder()
                    .setURL('https://i.ibb.co/CzsmzFR/atena-pensive.png')
                )
            )
            .addActionRowComponents(
                new ActionRowBuilder<ButtonBuilder>()
                .setComponents(
                    new ButtonBuilder()
                    .setLabel('Como usar')
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("how_to_use"),
                    new ButtonBuilder()
                    .setLabel('Parâmetros')
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("parameters"),
                    new ButtonBuilder()
                    .setLabel('Apelidos')
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("aliases"),
                ),
            )
        ]

        if(commandName === "help"){
            components.push(
                new ActionRowBuilder<StringSelectMenuBuilder>()
                .addComponents(
                    new StringSelectMenuBuilder()
                    .setCustomId("menu_command")
                    .setOptions(
                        Bot.instance.commands.map((command) => {
                            return new StringSelectMenuOptionBuilder()
                                .setLabel(command.name)
                                .setValue(command.name)
                        })
                    )
                )
            )
        }
    
        return {
            components: components,
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
        };
    }
}