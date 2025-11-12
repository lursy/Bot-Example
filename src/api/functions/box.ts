import { IBox, IBoxGroup, IUserChoice } from "../interfaces/IBox";
import { generateToken } from "../token";

export async function getBox(box_group_id: string): Promise<{ group: IBoxGroup | null, boxes: (IBox | null)[], userChoices: (IUserChoice | null)[] } | null>{
    const data = await fetch(`${process.env.API}/box/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ generateToken() }`
        },
        body: JSON.stringify({ box_group_id })
    });

    if(data.status !== 200){
        return null;
    }

    const box = await data.json();

    return box;
}

export async function createBox(box_group: IBox[]): Promise<IBoxGroup | null>{
    const data = await fetch(`${process.env.API}/box/create`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ generateToken() }`
        },
        body: JSON.stringify(box_group)
    });

    if(data.status !== 200){
        return null;
    }

    const boxes = await data.json();

    return boxes;
}

export async function updateBox(user_id: string, box_group_id: string, box_id: string): Promise<IUserChoice | null>{
    const data = await fetch(`${process.env.API}/box/update`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ generateToken() }`
        },
        body: JSON.stringify({ user_id, box_group_id, box_id })
    });

    if(data.status !== 200){
        return null;
    }

    const update = await data.json();

    return update;
}