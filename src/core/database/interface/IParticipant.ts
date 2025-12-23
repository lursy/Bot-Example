import { Document, Types } from "mongoose";

export interface IParticipant extends Document {
    _id: Types.ObjectId
    user_id: string;
    raffle_id: string;
    total_tickets: number;
}
