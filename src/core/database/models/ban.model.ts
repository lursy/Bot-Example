import { IBan } from '../interface/IBan';
import { Schema, model } from 'mongoose';


const BanSchema: Schema = new Schema({
    user_id: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Number, required: true },
    reason: { type: String, required: true },
});

const Ban = model<IBan>('Ban', BanSchema);

export { Ban };
