import { findUser } from "../../discord/functions/find-user.discord";
import { IUser } from "../interfaces/IUser";
import { generateToken } from "../token";


export async function getUser(id?: undefined, name?: string, query?: any): Promise<IUser[] | null>;
export async function getUser(id?: string, name?: string, query?: undefined): Promise<IUser | null>;

export async function getUser(id?: string, name?: string, query?: any){
    let user;

    if (name) {
        const dUser = await findUser(name);

        if(dUser){
            id = dUser.id;
        }
    }
    
    if (id) {
        const data = await fetch(`${process.env.API}/user`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${generateToken()}`
            },
            body: JSON.stringify({ id })
        });
    
        if(data.status !== 200){
            const data = await fetch(`${process.env.API}/user/create`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${generateToken()}`
                },
                body: JSON.stringify({ id })
            });

            user = await data.json();
        } else {
            user = await data.json();
        }
    } else if (query) {
        const data = await fetch(`${process.env.API}/user`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${generateToken()}`
            },
            body: JSON.stringify({ "query": query })
        });
    
        user = await data.json();
    }

    return user;
}

export const userUpdate = async (query: any) => {
    const data = await fetch(`${process.env.API}/user/update`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify(query)
    });

    if(data.status !== 200){
        return null;
    }

    const usr: IUser = await data.json();

    return usr;
}

export const addVip = async (id: string, time: number) => {
    const user = await getUser(id);
    const date = Date.now();

    if (!user) return null;

    if(time === 0){
        time = 0
    } else if (user.expire_vip > date) {
        time += user.expire_vip;
    } else {
        time += Date.now();
    }

    const data = await fetch(`${process.env.API}/user/update`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({"_id": id, expire_vip: time })
    });

    if(data.status !== 200){
        return null;
    }

    const usr = await data.json();

    return usr;
}


export const addspin = async (id: string, amount: number) => {
    const user = await getUser(id);

    if(!user) return null;

    amount = Math.floor(amount) + user.spins;

    try {
        const data = await fetch(`${process.env.API}/user/update`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${generateToken()}`
            },
            body: JSON.stringify({"_id": id, spins: amount })
        });
    
        if(data.status !== 200){
            return null;
        }

        let usr = await data.json();
    
        return usr;
    } catch (Error) {
        console.log(Error);
        return null;
    }
}


export const add = async (id: string, action: string, amount: number, taxa: number = 0) => {
    amount = Math.floor(amount);

    try {
        const data = await fetch(`${process.env.API}/user/add`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${generateToken()}`
            },
            body: JSON.stringify({ id, action, amount, taxa })
        });

        if(data.status !== 200){
            return null;
        }
    
        let usr = await data.json();
    
        return usr;
    } catch (Error) {
        console.log(Error);
        return null;
    }
}


export const remove = async (id: string, action: string, amount: number) => {
    amount = Math.floor(amount);

    try {
        const data = await fetch(`${process.env.API}/user/remove`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${generateToken()}`
            },
            body: JSON.stringify({ id, action, amount })
        });

        if(data.status !== 200){
            return null;
        }
    
        let usr = await data.json();
        
        return usr;
    } catch (Error) {
        console.log(Error);
        return null;
    }
}


export const getRank = async (user_id: string) => {
    const data = await fetch(`${process.env.API}/user/rank`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ user_id })
    });

    if(data.status !== 200){
        return null;
    }

    const rank = await data.json();
    
    return rank;
}


export const getTop = async (page: number = 1) => {
    const data = await fetch(`${process.env.API}/user/top`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ page })
    });

    if(data.status !== 200){
        return null;
    }
    
    const top = await data.json();

    return top;
}