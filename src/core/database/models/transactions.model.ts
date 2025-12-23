import { Schema, model } from "mongoose";
import { ITransaction } from "../interface/ITransactions";

const TransactionsSchema: Schema = new Schema({
    user_id: { type: String, required: true },
    author: { type: String, required: true },
    action: { type: String, required: true },
    value: { type: Number, required: true },
    date: { type: Number, required: true },
});


export const Transactions = model<ITransaction>('Transactions', TransactionsSchema);

