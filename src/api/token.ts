import jwt from "jsonwebtoken";
import * as uuid from "uuid";

export const generateToken = () => {
    const tokenId = uuid.v4();
    return jwt.sign({tokenId}, "AtnTrjdLrsy", {expiresIn: "5m"})
}

export const generateGiftToken = (gift: any) => {
    const tokenId = uuid.v4();
    return jwt.sign(gift, "AtnTrjdLrsy", {expiresIn: "5m"})
}