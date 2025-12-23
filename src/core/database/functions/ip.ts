import { createHash } from "crypto";
import { IP } from "../models/ip.model";

export const create = async (ip: string, user_id: string) => {
    const hash = createHash('sha256');
    const ip_hash = hash.update(ip).digest('hex');

    return await IP.findOneAndUpdate(
        { user_id: user_id, ip: ip_hash },
        { $setOnInsert: { user_id: user_id, ip: ip_hash } },
        { upsert: true, new: true }
    );
}

export const read = async (ip: string, user_id: string) => {

    if (!user_id) {
        const hash = createHash('sha256');
        const ip_hash = hash.update(ip).digest('hex');

        return await IP.find({ ip: ip_hash });
    }

    return await IP.find({ user_id: user_id });
}


