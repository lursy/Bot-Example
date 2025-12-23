import { Participant } from "../models/participants.model";


export const create = async (user_id: string, raffle_id: string, tickets: number) => {
    return await Participant.create({
        user_id: user_id,
        raffle_id: raffle_id,
        total_tickets: tickets
    });
}

export const read = async (user_id: string, raffle_id: string, query?: any, skip: number = 0) => {
    if (query) {
        return await Participant.find(query)
    }

    if (!raffle_id) {
        return await Participant.find({ user_id: user_id });
    }

    if (!user_id) {
        return Participant.find({ raffle_id })
            .sort({ total_tickets: -1 })
            .skip(skip)
            .limit(11)
    }

    return await Participant.findOne({ user_id: user_id, raffle_id: raffle_id });
}

export const update = async (user_id: string, tickets: number, raffle_id: string) => {
    return await Participant.findOneAndUpdate(
        { user_id: user_id, raffle_id: raffle_id },
        { $inc: { total_tickets: tickets } },
        { upsert: true, new: true }
    );
}

export const del = async (raffle_id: string) => {
    return await Participant.deleteMany({ raffle_id: raffle_id });
}
