import { Schema, model } from "mongoose";
import { IGame } from "../interface/IGame";

const GameSchema: Schema = new Schema({
    user_id: { type: String },
    game: { type: String },
    played: { type: Number, default: 0 },
    sequence: { type: Number, default: 0 },
    win: { type: Number, default: 0 },
    lose: { type: Number, default: 0 },
});

GameSchema.index({ user_id: 1, game: 1 }, { unique: true });

export const Game = model<IGame>('Game', GameSchema);

