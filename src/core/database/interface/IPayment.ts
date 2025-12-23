import { Document, Types } from "mongoose";

export interface IPayment extends Document {
   _id: Types.ObjectId
    txid: string;
    socket_id: string;
    query: {
        _id: string,
        money?: number,
        expire_vip?: number,
        spins?: number
    };
}