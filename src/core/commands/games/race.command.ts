import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, Channel, ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, Message, MessageFlags, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder, ThumbnailBuilder } from "discord.js";
import { TransactionResult } from "../../../interfaces/transaction.interface";
import { RegisterCommand } from "../../../decorators/command.decorator";
import { findUser } from "../../../discord/functions/find-user.discord";
import { transaction } from "../../database/functions/money";
import { Command } from "../../../enitities/command.entity";
import { valueParser } from "../../../utils/value-parser";
import { getUser } from "../../database/functions/user";
import { CommandDTO } from "../../../dtos/command.dto";
import { redis } from "../../database/redis";
import { GamesGroupe } from "./_index";
import { Bot } from "../../bot";

@RegisterCommand(GamesGroupe)
export class Race extends Command {
    public readonly group: string;
    // private global: Channel | null = null;

    constructor(nameGroup: string) {
        super({
            cooldown: 1000,
            description: "Entre em um combate de emojis!",
            name: "combate",
            aliases: [],
            options: [
                {
                    name: 'valor',
                    type: ApplicationCommandOptionType.String as number,
                    description: 'Valor da aposta',
                    required: false
                },
                {
                    name: 'participantes',
                    type: ApplicationCommandOptionType.Number as number,
                    description: 'Quantidade de participantes',
                    required: false
                }
            ]
        });

        this.group = nameGroup;
    }

    public async execute(data: CommandDTO, value: string = '0', maxPlayers: number = 30) {
        const discordUser = data.type == "prefix" ? data.command.author : data.command.user;
        const atenaUser = data.user;
        const betAmount = valueParser(value, atenaUser.money);

        // if (!this.global) {
        //     this.global = await Bot.instance.client.channels.fetch('1445910314141876438');
        // }

        if (isNaN(betAmount)) {
            data.command.reply({
                content: `${Bot.settings.emojis.warnning} ${discordUser} Você precisa inserir um valor válido!`,
                flags: MessageFlags.Ephemeral | 0
            });
            return;
        }
        
        if(isNaN(maxPlayers)){
            data.command.reply({
                content: `${Bot.settings.emojis.warnning} ${discordUser} Você precisa inserir um número de participantes válido!`,
                flags: MessageFlags.Ephemeral | 0
            });
            return;
        }

        if (atenaUser.daily < Date.now()) {
            data.command.reply({
                content: `${Bot.settings.emojis.sun} **|** ${discordUser} Você ainda não coletou sua recompensa diária, para continuar você pode clicar em: [coletar recompensa diária](<${process.env.WEBSITE}/daily>)`,
                flags: MessageFlags.Ephemeral | 0
            });
            return;
        }

        if (betAmount > atenaUser.money) {
            data.command.reply({
                content: `${Bot.settings.emojis.warnning} **|** ${discordUser} Ei! Você esta tentando apostar as magias que não tem? ta tonto é?\n**${Bot.settings.emojis.money} ${(betAmount - data.user.money).toLocaleString('de-DE')} ${Bot.settings.money}**! É o que falta para conseguir fazer uma aposta desse porte. `,
                flags: MessageFlags.Ephemeral | 0
            });
            return;
        }

        if (betAmount < 20 && betAmount != 0) {
            data.command.reply({
                content: `${Bot.settings.emojis.error} ${discordUser} Você precisa fazer apostas acima de **20 ${Bot.settings.money}!**`,
                flags: MessageFlags.Ephemeral | 0
            });
            return;
        }

        if (maxPlayers > 30 || maxPlayers == 0) maxPlayers = 30;
        if (maxPlayers < 2) maxPlayers = 2;

        const timestamp = Date.now();
        const raceId = `race:${timestamp}${Math.round(Math.random() * 1000)}`;
        
        await redis.hset(raceId, {
            author_id: discordUser.id,
            max_players: maxPlayers,
            bet_amount: betAmount,
            created_at: Date.now(),
            status: 'open'
        });

        redis.expire(raceId, 90);

        const emoji = await data.user.getEmoji();
        const response = await redis.joinRace(raceId, discordUser.id, emoji);

        if(response != "ok"){
            data.command.reply(`${Bot.settings.emojis.error} **|** Erro inesperado, entre em contato com a nossa equipe para informar o ocorrido.`)
            return;
        }

        const template = await Race.template(betAmount, raceId, maxPlayers, discordUser.id, { status: false });
        const message = await data.command.reply(template) as Message<boolean>;

        setTimeout(async () => {
            const race = await redis.hgetall(raceId);
            
            if(race.status === "open"){
                await redis.hset(raceId, 'status', 'closed');
                Race.end(message, raceId)
            }
        }, 60000)
    }

    static async template(
        value: number,
        id: string,
        max: number,
        authorId: string,
        end: {
            status: true,
            taxa: string,
            winner: {
                id: string,
                emoji: string
            }
        } | {
            status: false,
        }
    ) {
        const participants = await redis.hgetall(`${id}:participants`);
        const players = Object.keys(participants);
        const playersContent = players.map((userId, index) => {
                const emoji = participants[userId];
                return `${emoji} **|** <@${userId}>${index + 1 <= players.length ? '\n' : null}`;
            }
        );

        const filePath = './src/assets/atena_race.webp';
        let total = value * players.length;

        const components: (ContainerBuilder | ActionRowBuilder<ButtonBuilder>)[] = [
            new ContainerBuilder()
                .setAccentColor(0xD037D1)
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder()
                        .addItems(
                            new MediaGalleryItemBuilder()
                                .setURL('attachment://atena_race.webp')
                        )
                )
                .addSeparatorComponents(
                    new SeparatorBuilder()
                        .setSpacing(SeparatorSpacingSize.Large)
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(value != 0 ? `Preço para participar: **${Bot.settings.emojis.money} ${value.toLocaleString('de-DE')} Magias**\nPrêmiação atual: **${Bot.settings.emojis.money} ${total.toLocaleString('de-DE')} Magias**\n\n## Participantes (${players.length}/${max})\n${playersContent.join('')}` : `\n\n## Participantes (${players.length}/${max})\n${playersContent.join('')}`),
                )
                .addSeparatorComponents(
                    new SeparatorBuilder()
                        .setSpacing(SeparatorSpacingSize.Large)
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`-# O ganhador será revelado quando <@${authorId}> clicar em ${Bot.settings.emojis.check} Finalizar,\n-# após 60 segundos, ou assim que atingir o máximo participantes entrarem na batalha.\n-# ${Bot.settings.emojis.shiny} [Servidor Oficial](<https://discord.gg/voltz>)`),
                )
        ];

        if (end.status) {
            if (players.length == 1) {
                components.push(
                    new ContainerBuilder()
                        .setAccentColor(0xff0000)
                        .addSectionComponents(
                            new SectionBuilder()
                                .addTextDisplayComponents(
                                    new TextDisplayBuilder()
                                        .setContent(`${Bot.settings.emojis.error} Batalha encerrada!\n\nA batalha não obteve o numero mínimo de participantes. Tente novamente em uma próxima partida!`)
                                )
                                .setThumbnailAccessory(
                                    new ThumbnailBuilder()
                                        .setURL(Bot.settings.images.atena.sad)
                                )
                        )
                );
            } else {
                const discordWinner = await findUser(end.winner.id);
                const thumb = discordWinner?.displayAvatarURL({ extension: 'webp', size: 256 });
    
                components.push(
                    new ContainerBuilder()
                        .setAccentColor(0x00ff22)
                        .addSectionComponents(
                            new SectionBuilder()
                                .addTextDisplayComponents(
                                    new TextDisplayBuilder()
                                        .setContent(`${end.winner.emoji}  **|** <@${end.winner.id}> venceu essa batalha!` + (total > 0 ? `\n\n# Ganho de: +${(total-value).toLocaleString('de-DE')} Magias\n-# ${end.taxa}` : `\n\n# Ganho de: ${Bot.settings.emojis.shiny} Aura`))
                                )
                                .setThumbnailAccessory(
                                    new ThumbnailBuilder()
                                        .setURL(thumb ?? Bot.settings.images.atena.smile)
                                )
                        )
                );
            }

        }

        components.push(
            new ActionRowBuilder<ButtonBuilder>()
                .setComponents(
                    new ButtonBuilder()
                        .setLabel('Entrar')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(Bot.settings.emojis.punch)
                        .setCustomId(`rj-${id}`)
                        .setDisabled(end.status),
                    new ButtonBuilder()
                        .setLabel('Finalizar')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji(Bot.settings.emojis.check)
                        .setCustomId(`re-${id}`)
                        .setDisabled(end.status)
                )
        );

        return {
            components: components,
            files: [{
                name: 'atena_race.webp',
                attachment: filePath
            }],
            flags: MessageFlags.IsComponentsV2 | 0
        };
    }

    static async end(message: Message<boolean>, raceId: string){
        const race = await redis.hgetall(raceId);
        const authorId = race.author_id
        const participants = await redis.hgetall(`${raceId}:participants`);
        const participantsId = Object.keys(participants);
        const maxParticipants = Number(race.max_players);
        const betAmount = Number(race.bet_amount);

        const winIndex = Math.floor(Math.random() * participantsId.length);
        let winnerId = participantsId[winIndex];
        let winnerEmoji = participants[winnerId];
        let taxaContent = '( 5% de taxa )';
        participantsId.splice(winIndex, 1);

        if (participantsId.length > 1) {
            let taxaPercent: number = Bot.settings.taxa;
            let total = participantsId.length * betAmount;

            if (betAmount) {
                if (!race) {
                    return {
                        content: `${Bot.settings.emojis.error} **|** Erro ao finalizar batalha. Não entre em pâmico, estamos verificando a situação`
                    }
                }

                let winner = await getUser({ id: winnerId });

                if (winner) {
                    const privilege = await winner.getPrivilege();

                    if (privilege === 'vip') {
                        taxaPercent = 0;
                        taxaContent = '( sem taxa: usuário **vip** )'
                    }

                    if (privilege === 'booster') {
                        taxaPercent = Math.floor(total * Bot.settings.taxa / 2 / 100);
                        taxaContent = `( ${Bot.settings.taxa / 2}% de taxa: usuário **booster** )`
                    }

                    let payments: TransactionResult | null = null;

                    while (participantsId.length - 1) {
                        const data = {
                            action: "race",
                            amount: betAmount,
                            author: authorId,
                            payer_id: participantsId,
                            receiver_id: winnerId,
                            taxa: taxaPercent
                        }

                        payments = await transaction(data);
                        console.log(payments);

                        if (payments.status !== "error_receiver") {
                            break;
                        }

                        message.reply({
                            content: `${Bot.settings.emojis.error} O usuário <@${winnerId}> saiu da batalha, pois não tinha saldo suficiente`
                        });

                        const winIndex = Math.floor(Math.random() * participantsId.length);
                        winnerId = participantsId[winIndex];
                        winnerEmoji = participants[winnerId];

                        await redis.hdel(`${raceId}:participants`, winnerId);
                        participantsId.splice(winIndex, 1);
                    };

                    if (!payments || payments.status === "error_max_retries") {
                        console.error(`[ERRO] - max retry excedido durante transação de race. ${winnerId}`);
                        message.reply({
                            content: `${Bot.settings.emojis.error} **|** Problemas internos, não se preocupe. Já estamos de olho!`
                        })
                        return;
                    }

                    if (payments.status === "error_payer") {
                        message.reply({
                            content: `${Bot.settings.emojis.error} ${payments.failed_ids.map(id => `${Bot.settings.emojis.atena_cop} | <@${id}> não tinha saldo suficiente.\n`)}`
                        });
                    }

                    let participants_id = payments.payer.data!.map((element: any) => element._id);
                    total = participants_id.length * betAmount;

                    if (total === betAmount) {
                        message.reply({
                            content: `${Bot.settings.emojis.error} A batalha foi cancelada, os participantes não tiveram saldo suficiente para essa batalha`
                        })
                        return;
                    }
                }
            }
        }

        const template = await Race.template(betAmount, raceId, maxParticipants, race.author_id, {
            status: true,
            taxa: taxaContent,
            winner: {
                id: winnerId,
                emoji: winnerEmoji
            }
        });

        message.edit(template);
        return;
    }
}