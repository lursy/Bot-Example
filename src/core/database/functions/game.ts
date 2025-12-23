import { IGame } from "../interface/IGame";
import { Game } from "../models/game.model";

export const create_game = async (user_id: string, game: string) => {

    return await Game.findOneAndUpdate(
        { user_id: user_id, game: game },
        { $setOnInsert: { user_id: user_id, game: game } },
        { upsert: true, new: true }
    );
}

export const read_game = async (game: string, user_id: string) => {
    if (game && user_id) {
        return await Game.findOne({ user_id: user_id, game: game });
    }

    if (!game) {
        return await Game.find({ user_id: user_id });
    } else {
        return await Game.find({ game: game });
    }
}

export const update_game = async (game: string, user_id: string, updateData: IGame) => {

    return await Game.findOneAndUpdate(
        { user_id: user_id, game: game },
        updateData
    );
}

export const delete_game = async (game: string, user_id: string) => {
    if (game && user_id) {
        return Game.findOneAndDelete({ user_id: user_id, game: game });
    }

    return await Game.deleteMany({ user_id: user_id });
}

export const win_game = async (id: string, name: string) => {
    return await Game.findOneAndUpdate(
        { user_id: id, game: name },
        { $inc: { win: 1, sequence: 1, played: 1 } },
        { upsert: true, new: true }
    );
}

export const lose_game = async (id: string, name: string) => {
    return await Game.findOneAndUpdate(
        { user_id: id, game: name },
        { $inc: { lose: 1, played: 1 }, sequence: 0 },
        { upsert: true, new: true }
    );
}