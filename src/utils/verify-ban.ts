
import { EmbedBuilder } from "@discordjs/builders";
import { IUser } from "../core/database/interface/IUser";
import { findUser } from "../discord/functions/find-user.discord";
import { deleteBan, getBan } from "../core/database/functions/ban";

type ban = {
    status: false
} | {
    status: true,
    embed: EmbedBuilder
}

export async function isBanned(user: IUser): Promise<ban> {
    const author = await findUser(user._id);

    if (!author) {
        return { status: false }
    }

    if (user.level < 0) {
        let ban_info = await getBan(user._id);

        if (!ban_info) return { status: false };

        if (ban_info.date < Date.now() && ban_info.date !== 0) {
            deleteBan(author.id);
            user.level = 0;
        } else {
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: author.displayName,
                    iconURL: author.displayAvatarURL({ size: 128, extension: 'webp' }),
                })
                .setTitle("Você foi banido!")
                .addFields(
                    {
                        name: "ID",
                        value: ban_info._id.toString(),
                        inline: true
                    },
                    {
                        name: "Author",
                        value: `<@${ban_info.author}>`,
                        inline: true
                    },
                    {
                        name: "Tempo",
                        value: ban_info.date > 0 ? `<t:${Math.floor(ban_info.date / 1000)}:R>` : "Permanente",
                        inline: false
                    },
                    {
                        name: "Motivo",
                        value: ban_info.reason,
                        inline: false
                    },
                )
                .setColor([255, 0, 0]);

            return { status: true, embed }
        }
    }

    return { status: false }
}