import { Participant } from "../models/participants.model";
import { Raffle } from "../models/raffle.model";
import { startSession } from "mongoose";

export const create_raffle = async (options: {
    time: number,
    last_winner?: {
        id: string,
        name: string,
        tickets: number
    },
    type?: number
}) => {
    const { time, last_winner, type } = options;
    let date = time + Date.now();

    return await Raffle.create({
        date,
        last_winner,
        type
    });
}

export const read_raffle = async (raffle_id?: string, type?: number) => {
    if (!raffle_id) {
        return await Raffle.findOne({ type: type ?? 0 }).sort({ date: -1 });
    }

    return await Raffle.findById(raffle_id);
}

export const update_raffle = async (
    user_id: string,
    raffle_id: string,
    tickets: number,
    value: number
) => {
    const session = await startSession();
    const maxRetries = 5; // Número máximo de tentativas
    let attempt = 0;

    try {
        while (attempt < maxRetries) {
            attempt++;
            try {
                // Use `withTransaction` para gerenciar a transação
                return await session.withTransaction(async () => {
                    // Busca o sorteio e verifica se existe
                    const raffle = await Raffle.findById(raffle_id).session(session);
                    if (!raffle) throw new Error("Raffle not found");

                    // Define o limite de tickets com base no tipo
                    const ticketLimit = raffle.type ? 50000 : 500000;

                    // Atualiza o participante ou insere, respeitando o limite de tickets
                    const participantUpdate = await Participant.updateOne(
                        { user_id, raffle_id, total_tickets: { $lt: ticketLimit } },
                        { $inc: { total_tickets: tickets } },
                        { upsert: true, session }
                    );

                    if (participantUpdate.upsertedId) {
                        raffle.participants += 1;
                    }

                    raffle.tickets += tickets;
                    raffle.value += tickets * value;

                    // Salva o sorteio atualizado
                    await raffle.save({ session });
                    return raffle;
                });
            } catch (error: any) {
                // Verifica se é um erro transitório e tenta novamente
                if (error?.errorLabels?.includes("TransientTransactionError")) {
                    console.warn(`Retrying transaction (Attempt ${attempt}/${maxRetries})`);
                    continue;
                }

                // Lança outros erros imediatamente
                throw error;
            }
        }

        // Se o loop terminar sem sucesso
        throw new Error("Max retry attempts reached. Transaction failed.");
    } finally {
        // Garante que a sessão será encerrada
        session.endSession();
    }
};


export const delete_raffle = async (raffle_id: string) => {
    const session = await startSession();
    session.startTransaction();

    try {
        // Remove os participantes associados
        await Participant.deleteMany({ raffle_id }).session(session);

        // Remove o sorteio
        await Raffle.findByIdAndDelete(raffle_id).session(session);

        // Confirma a transação
        await session.commitTransaction();
    } catch (error) {
        // Reverte a transação em caso de erro
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};
