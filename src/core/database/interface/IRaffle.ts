import { Document, Types } from "mongoose";

export interface IRaffle extends Document {
    _id: Types.ObjectId
    date: number;
    type: number;
    value: number;
    tickets: number;
    last_winner: { id: string, name: string, tickets: number } | null;
    participants: number;
}