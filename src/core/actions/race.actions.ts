import { ButtonInteraction, MessageFlags, User } from "discord.js";
import { UserEntity } from "../../enitities/user.entity";
import { Race } from "../commands/games/race.command";
import { getUser } from "../database/functions/user";
import { redis } from "../database/redis";
import { Bot } from "../bot";
import { TransactionResult } from "../../interfaces/transaction.interface";
import { transaction } from "../database/functions/money";

export class RaceActions {
    static async join(interaction: ButtonInteraction, raceId: string, author: UserEntity) {
        const participants = await redis.hgetall(`${raceId}:participants`);
        const race = await redis.hgetall(raceId);
        const participantsId = Object.keys(participants);
        const maxParticipants = Number(race.max_players);
        const betAmount = Number(race.bet_amount);

        if (author.daily < Date.now()) {
            interaction.reply({
                content: `${Bot.settings.emojis.sun} **|** <@${race.author_id}> Você ainda não coletou sua recompensa diária, para continuar você pode [coletar recompensa diária](<${process.env.WEBSITE}/daily>)`,
                flags: MessageFlags.Ephemeral | 0
            });
            return;
        }

        const emoji = await author.getEmoji();
        const response = await redis.joinRace(raceId, interaction.user.id, emoji);

        
        if (betAmount > author.money) {
            interaction.reply({
                content: `${Bot.settings.emojis.warnning} ${interaction.user}, Você não tem magias suficientes para entrar nessa batalha!`,
                flags: MessageFlags.Ephemeral | 0
            });
            return;
        }
        
        if (response === "race_closed" || response === "race_not_found") {
            interaction.reply({
                content: `${Bot.settings.emojis.error} ${interaction.user}, Essa batalha já acabou!`,
                flags: MessageFlags.Ephemeral | 0
            });
            return;
        }
        
        if (response === "already_participating") {
            interaction.reply({
                content: `${Bot.settings.emojis.error} ${interaction.user}, Você já entrou nessa batalha! Aguarde o resultado ser revelado!`,
                flags: MessageFlags.Ephemeral | 0
            });
            return;
        }
        
        interaction.deferUpdate();

        if(participantsId.length+1 === maxParticipants){
            await redis.hset(raceId, 'status', 'closed');
            Race.end(interaction.message, raceId);
            return;
        }

        const template = await Race.template(betAmount, raceId, maxParticipants, race.author_id, { status: false });
        interaction.message.edit(template);

        if (participantsId.length >= maxParticipants) {
            await redis.hset(raceId, 'status', 'closed');
            Race.end(interaction.message, raceId);
        }
    }

    static async end(interaction: ButtonInteraction, raceId: string, author: UserEntity) {
        const authorId = await redis.hget(raceId, 'author_id');

        if (interaction.user.id !== authorId) {
            interaction.reply({
                content: `${Bot.settings.emojis.error} Isso não é pra você.`,
                flags: MessageFlags.Ephemeral
            });

            return;
        }

        if (!interaction.replied) {
            interaction.deferUpdate();
        }

        Race.end(interaction.message, raceId);
    }
}