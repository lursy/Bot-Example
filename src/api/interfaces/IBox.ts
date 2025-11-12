export interface IBox {
    _id?: string,
    date?: Date;
    max_users?: number;
    rarity?: "normal" | "silver" | "gold" | "diamond" | "mystic"; // Raridade da caixa
    gift: {
        expire_vip?: number; 
        money?: number;
        spins?: number;
    };
}

export interface IBoxGroup {
    _id: string;
    boxes: {
        box_id: string,
        chosen_count: number
    }[];
}

export interface IUserChoice extends Document {
    _id: string;
    user_id: string;
    box_id: string;
    box_group_id: string;
    chosen_at: number;
}