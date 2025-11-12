export interface IGuild {
    _id: string;
    guild_id: string;
    prefix: string | null;
    blocked_chats: {name: string, id: string}[];
}
