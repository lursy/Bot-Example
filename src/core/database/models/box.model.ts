import { IBox, IBoxGroup, IUserChoice } from '../interface/IBox';
import { Schema, model, Types } from 'mongoose';

const BoxSchema: Schema = new Schema({
    date: { type: Date, default: Date.now },
    max_users: { type: Number, default: 15 },
    rarity: {
        type: String,
        enum: ["normal", "silver", "gold", "diamond", "mystic"],
        default: "normal"
    },
    gift: {
        expire_vip: { type: Number, undefined: 0 },
        money: { type: Number, undefined: 0 },
        spins: { type: Number, undefined: 0 }
    }
}, {
    capped: { capped: true, size: 7000, max: 100 }
});

const BoxGroupSchema: Schema = new Schema({
    boxes: [
        {
            box_id: { type: Types.ObjectId, ref: 'Box' }, // Referência para as caixas
            chosen_count: { type: Number, default: 0 }, // Quantidade de usuários que escolheram esta caixa
        }
    ],
}, {
    capped: { capped: true, size: 3500, max: 50 }
});

const UserChoiceSchema: Schema = new Schema({
    user_id: { type: String, required: true }, // ID do usuário
    box_group_id: { type: Types.ObjectId, ref: 'BoxGroup', required: true }, // Referência ao grupo de caixas
    box_id: { type: Types.ObjectId, ref: 'Box', required: true }, // Referência à caixa escolhida
    chosen_at: { type: Date, default: Date.now }, // Data de escolha
});

UserChoiceSchema.index({ user_id: 1, box_group_id: 1 }, { unique: true });

const Box = model<IBox>('Box', BoxSchema);
const BoxGroup = model<IBoxGroup>('BoxGroup', BoxGroupSchema);
const UserChoice = model<IUserChoice>('UserChoice', UserChoiceSchema);

export { Box, BoxGroup, UserChoice };

