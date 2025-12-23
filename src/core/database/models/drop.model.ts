import { Schema, model } from 'mongoose';
import { IDrop } from '../interface/IDrop';


const DropSchema: Schema = new Schema({
    value: { type: Number, required: true },
    date: { type: Number, required: true },
    users: { type: Array, default: [] }
}, {
    capped: { max: 50 }
});

const Drop = model<IDrop>('Drop', DropSchema);

export { Drop };
