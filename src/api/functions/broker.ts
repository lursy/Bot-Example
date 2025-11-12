import { IBroker } from "../interfaces/IBroker";
import { generateToken } from "../token";

export async function getBroker(user_id: string, crypto: string): Promise<IBroker | null>;
export async function getBroker(user_id: string, crypto?: undefined): Promise<IBroker[] | null>;

export async function getBroker(user_id: string, crypto?: string){
    const data = await fetch(`${process.env.API}/broker/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ user_id, crypto })
    });

    if(data.status !== 200){
        return null;
    }

    if(crypto){
        const broker: IBroker =  await data.json();
    
        return broker;
    }

    const broker: IBroker[] =  await data.json();
    
    return broker;
}

export async function createBroker(user_id: string, crypto: string): Promise<IBroker | null>{
    const data = await fetch(`${process.env.API}/broker/create`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ user_id, crypto })
    });

    if(data.status !== 200){
        return null;
    }

    const broker = await data.json();

    return broker;
}

export async function updateBroker(user_id: string, crypto: string, amount: number, value: number): Promise<IBroker | null>{
    const data = await fetch(`${process.env.API}/broker/update`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ user_id, crypto, amount, value })
    });

    if(data.status !== 200){
        return null;
    }

    const broker = await data.json();

    return broker;
}

export async function deleteBroker(user_id: string, crypto: string): Promise<IBroker | null>{
    const data = await fetch(`${process.env.API}/ban/delete`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ user_id, crypto })
    });

    if(data.status !== 200){
        return null;
    }

    const broker = await data.json();

    return broker;
}