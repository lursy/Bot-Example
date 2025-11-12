import { ITransaction } from "../interfaces/ITransactions";
import { IUser } from "../interfaces/IUser";
import { generateToken } from "../token";


export async function tr(
    payer_id: string[],
    receiver_id: string,
    action: string,
    amount: number,
    author: string,
    taxa?: number
): Promise<{
    status: "error_payer" | "success" | "error_receiver",
    payer: {
        data: IUser[] | null,
        tr: ITransaction | null
    },
    receiver: {
        data: IUser | null,
        tr: ITransaction | null
    }
}>;

export async function tr(
    payer_id: string[],
    receiver_id: string,
    action: string,
    amount: number,
    author: string,
    taxa: number = 0 
){
    const data = await fetch(`${process.env.API}/user/tr`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ generateToken() }`
        },
        body: JSON.stringify({ payer_id, receiver_id, action, author, amount, taxa })
    });

    if(data.status !== 200){
        return null;
    }

    const transaction = await data.json();

    return transaction;
};