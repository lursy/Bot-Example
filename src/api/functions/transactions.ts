import { ITransaction } from "../interfaces/ITransactions";
import { generateToken } from "../token";

export async function getTransactions(options: {
        user_id?: string, 
        transaction_id?: string, 
        page?: number, 
        action?: string
    }
): Promise<{transactions: ITransaction[], count: number} | null>;

export async function getTransactions(
    options: {
        user_id?: string, 
        transaction_id?: string, 
        page?: number, 
        action?: string
    }
){
    let { user_id, transaction_id, page, action } = options;
    
    if(action === "all") action = undefined;

    const data = await fetch(`${process.env.API}/transaction/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ user_id, transaction_id, page, action })
    });

    if(data.status !== 200){
        return null;
    }

    const transaction = await data.json();

    return transaction;
}