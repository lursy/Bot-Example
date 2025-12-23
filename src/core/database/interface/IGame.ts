import { Document, Types } from "mongoose";

export interface IGame extends Document {
    _id: Types.ObjectId
    user_id: string;
    game: string;
    played: number;
    sequence: number;
    win: number;
    lose: number;
}
