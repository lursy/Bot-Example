import { Transactions } from "../models/transactions.model";
import { ITransaction } from "../interface/ITransactions";
import { User } from "../models/user.model";
import { IUser } from "../interface/IUser";
import mongoose from "mongoose";
import { TransactionResult } from "../../../interfaces/transaction.interface";

export const add_money = async (options: { id: string, action: string, amount: number }) => {
    let { id, action, amount } = options;

    amount = Math.floor(amount);

    const user = await User.findByIdAndUpdate(id, {
        $inc: { money: amount }
    });

    const tr = Transactions.create({
        user_id: id,
        action: action,
        author: id,
        value: amount,
        date: Date.now()
    });

    if (!tr) {
        console.log("Erro ao criar transação", tr);
    }

    return user;
}

export const remove_money = async (options: { id: string, action: string, amount: number }) => {
    let { id, action, amount } = options;
    amount = Math.floor(amount);

    try {
        const update = await User.updateOne({
            _id: id,
            money: { $gte: amount }
        }, {
            $inc: { money: -amount }
        });

        if (update.modifiedCount === 0) {
            return null;
        }

        const tr = await Transactions.create({ user_id: id, action: action, author: id, value: -amount, date: Date.now() });

        if (!tr) {
            console.log("Erro ao criar transação", tr);
        }

        return update;
    } catch (Error) {
        console.log(Error);

        return null;
    }
}

export const transaction = async (
    options: {
        payer_id: string[];
        receiver_id: string;
        action: string;
        author: string;
        amount: number;
        taxa: number;
    },
): Promise<TransactionResult> => {
    const { payer_id, receiver_id, action, taxa, author, amount } = options;
    const isPayment = action === "pay";
    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        const session = await mongoose.startSession();
        
        try {
            session.startTransaction();

            const chargeResults: { success: boolean, id: string, user: any }[] = [];

            for (const id of payer_id) {
                const updatedPayer = await User.findOneAndUpdate(
                    { _id: id, money: { $gte: amount } }, 
                    { $inc: { money: -amount } },        
                    { session, new: true }
                );
                
                chargeResults.push({ 
                    success: !!updatedPayer, 
                    id: id, 
                    user: updatedPayer 
                });
            }

            const failedPayers = chargeResults.filter(r => !r.success);
            
            if (failedPayers.length > 0) {
                await session.abortTransaction();
                
                return {
                    status: "error_payer",
                    failed_ids: failedPayers.map(f => f.id as string),
                    payer: { data: null, tr: null },
                    receiver: { data: null, tr: null }
                };
            }

            const successfulPayers = chargeResults.map(r => r.user!); 
            const winner_amount = successfulPayers.length * amount;
            const taxa_value = Math.floor(winner_amount * (taxa / 100));
            const receiver_amount = winner_amount - taxa_value;

            const receiverUpdate = await User.findOneAndUpdate(
                {
                    _id: receiver_id,
                    money: !isPayment ? { $gte: amount } : { $gte: 0 }
                },
                { $inc: { money: receiver_amount } },
                { session, new: true }
            );

            if (!receiverUpdate) {
                await session.abortTransaction();
                return {
                    status: "error_receiver",
                    failed_ids: [],
                    payer: { data: null, tr: null },
                    receiver: { data: null, tr: null }
                };
            }

            const payerLogsPromises = successfulPayers.map(payer => ({
                user_id: payer._id,
                action: action,
                value: -amount,
                author: receiver_id,
                date: Date.now()
            }));
            
            const receiverLogData = {
                user_id: receiver_id,
                action: action,
                value: receiver_amount,
                author: author,
                date: Date.now()
            };

            const createdPayerLogs = await Transactions.insertMany(payerLogsPromises, { session });
            
            const [createdReceiverLog] = await Transactions.insertMany([receiverLogData], { session });

            await session.commitTransaction();
            
            return {
                status: "success",
                failed_ids: [],
                payer: {
                    data: successfulPayers,
                    tr: createdPayerLogs
                },
                receiver: {
                    data: receiverUpdate,
                    tr: [createdReceiverLog]
                }
            };

        } catch (err: any) {
            const isTransientError = err.errorLabels && err.errorLabels.includes('TransientTransactionError');
            
            console.error(`Transaction attempt ${attempt + 1} failed:`, err.message);

            if (session.inTransaction()) {
                await session.abortTransaction();
            }

            attempt++;
            
            if (!isTransientError && attempt < MAX_RETRIES) {
                 break
            }

        } finally {
            await session.endSession();
        }
    }

    return {
        status: "error_max_retries",
        failed_ids: [],
        payer: { data: null, tr: null },
        receiver: { data: null, tr: null }
    };
};