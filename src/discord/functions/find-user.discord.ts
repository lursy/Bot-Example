import { snowflakeRegex, userRegex } from '../regex/mention.regex';
import { Guild, User } from 'discord.js';
import { Bot } from '../../core/bot';

export async function findUser(mention: string, guild?: Guild): Promise<User | undefined> {
    const bot = Bot.instance;

    const isSnowflake = snowflakeRegex.test(mention);
    const isMention = userRegex.test(mention);

    if (isSnowflake || isMention) {
        const id = mention.replace(userRegex, '$1');
        const cached = bot.client.users.cache.get(id);

        if (cached) return cached;

        return await bot.client.users.fetch(id).catch(() => undefined);
    }

    let user = bot.client.users.cache.find(u =>
        u.username.toLowerCase().includes(mention.toLowerCase()) ||
        u.globalName?.toLowerCase().includes(mention.toLowerCase())
    );

    if (!user && guild) {
        let member = guild.members.cache.find(m =>
            m.displayName.toLowerCase().includes(mention.toLowerCase())
        );

        if(!member){
            const members = await guild.members.fetch().catch(() => undefined);

            if(members){
                member = members.find(m =>
                    m.displayName.toLowerCase().includes(mention.toLowerCase())
                );
            }
        }

        if (member) {
            return member.user;
        }
    }

    return user;
}
