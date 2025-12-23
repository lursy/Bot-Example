import { Schema, model } from "mongoose";
import { IBroker } from "../interface/IBroker";

const BrokerSchema: Schema = new Schema({
    user_id: { type: String, required: true },
    crypto: { type: String, required: true },
    money: { type: Number, default: 0 },
    initial_money: { type: Number, default: 0},
    date: { type: Number, default: Date.now },
});

BrokerSchema.index({ user_id: 1, crypto: 1 }, { unique: true });

export const Broker = model<IBroker>('Broker', BrokerSchema);

