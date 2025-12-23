import { Bot } from "../core/bot";

export async function isBooster(userId: string){
    try {
        const guild = await Bot.instance.client.guilds.fetch(Bot.settings.guild);

        if (!guild) {
            console.log("Guild não encontrada!");
            return null;
        }

        const member = await guild.members.fetch(userId);

        return member.premiumSince;
    } catch (error) {
        // console.error("Erro ao buscar o GuildMember:", error);
        return null;
    }
}