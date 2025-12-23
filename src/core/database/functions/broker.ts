import { Broker } from "../models/broker.model";


export const create = async (user_id: string, crypto: string) => {
    return await Broker.create({ user_id, crypto });
}

export const read = async (user_id: string, crypto: string) => {
    if(!crypto){
        return await Broker.find({
            user_id
        });
    }
    
    return await Broker.findOne(
        { user_id, crypto }
    );
}

export const update = async (options: { user_id: string, crypto: string, amount: number, value: number }) => {
    return await Broker.findOneAndUpdate(
        {
            user_id: options.user_id,
            crypto: options.crypto,
            money: options.amount < 0 ? { $gte: Math.abs(options.amount) } : { $gte: 0 }
        },
        {
            $inc: {
                money: options.amount,
                initial_money: options.value
            },
            $setOnInsert: { date: Date.now() }
        },
        {
            upsert: options.amount > 0,
            new: true
        }
    );
}

export const del = async (user_id: string, crypto: string) => {
    return await Broker.deleteOne({user_id, crypto});
}

