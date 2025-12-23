import { Schema, model } from 'mongoose';
import { ICommand } from '../interface/ICommand';


const CommandSchema: Schema = new Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    help: {type: String, required: true},
    cooldown: { type: Number, default: 1000 }
});

const Command = model<ICommand>('Command', CommandSchema);

export { Command };
