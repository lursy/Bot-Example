export interface ITransaction{
    _id: string;
    user_id: string;
    author: string;
    action: string;
    value: number;
    date: number;
    money: number;
}
