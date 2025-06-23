import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();


export const signToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" })
}

export const verifyToken = (payload) => {
    const decoded = jwt.verify(payload, process.env.JWT_SECRET)
    return decoded.userId;

}
