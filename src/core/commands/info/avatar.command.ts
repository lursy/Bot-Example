import { findUser } from "../../../discord/functions/find-user.discord";
import { RegisterCommand } from "../../../decorators/command.decorator";
import { Command } from "../../../enitities/command.entity";
import { ApplicationCommandOptionType, ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, MessageFlags, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder, User } from "discord.js";
import { CommandDTO } from "../../../dtos/command.dto";
import { InfoGroup } from "./_index";

@RegisterCommand(InfoGroup)
class Find extends Command {
    public readonly group: string;
    constructor(nameGroup: string) {
        super({
            cooldown: 1000,
            description: "exibe o avatar de um usuário usuário",
            name: "avatar",
            aliases: ["a"],
            options: [
                {
                    name: 'usuário',
                    type: ApplicationCommandOptionType.User as number,
                    description: 'Mencione o usuário',
                    required: false,
                }
            ]
        });

        this.group = nameGroup;
    }

    public async execute(data: CommandDTO, mention?: string) {
        let user: User | undefined = data.type === "prefix" ? data.command.author : data.command.user; 

        if(mention){
            user = await findUser(mention, data.command.guild??undefined);
        }

        const message = this.template(user);
        
        await data.command.reply(message);
    }

    private template(user?: User) {
        if(!user){
            return {
                content: 'Usuário não encontrado...',
                flags: MessageFlags.Ephemeral as number
            };
        }

        const picture = user.displayAvatarURL({
            size: 1024
        })

        const components = [
            new ContainerBuilder()
            .setAccentColor(0xB24EC5)
            .addSeparatorComponents(
                new SeparatorBuilder()
                .setSpacing(SeparatorSpacingSize.Large)
            )
            .addMediaGalleryComponents(
                new MediaGalleryBuilder()
                .addItems(
                    new MediaGalleryItemBuilder()
                    .setURL(picture)
                )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                .setSpacing(SeparatorSpacingSize.Large)
            )
        ]

        return {
            components,
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
        }
    }
}