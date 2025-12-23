import { Schema, model } from "mongoose";
import { IPayment } from "../interface/IPayment";

const PaymentSchema: Schema = new Schema({
    txid: { type: String, unique: true },
    socket_id: { type: String, default: '0' },
    user_id: {type: String},
    value: {type: String},
    query: { type: Object },
});


export const Payment = model<IPayment>('Payment', PaymentSchema);
