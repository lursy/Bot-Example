import { User } from "../models/user.model";
import { Ban } from "../models/ban.model";


export const create = async (user_id: string, author: string, date: number, reason: string) => {
    User.findOneAndUpdate(
        { _id: user_id, level: { $gte: 0 } },
        { level: -1 },
        { upsert: true }
    );
    
    date += Date.now();

    return await Ban.findOneAndUpdate(
        { user_id },
        { date: date, reason: reason, author: author },
        { upsert: true, new: true }
    );
}

export const getBan = async (id?: string, user_id?: string) => {
    if (!id) {
        return await Ban.findOne({ user_id: user_id });
    }

    return await Ban.findById(id);
}


export const deleteBan = async (id?: string, user_id?: string) => {
    const user = await User.findByIdAndUpdate(user_id, { level: 0 });

    if (!id) return await Ban.deleteOne({ user_id: user_id });

    return await Ban.findByIdAndDelete(id);
}

