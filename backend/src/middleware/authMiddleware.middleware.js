import { verifyToken } from "../utils/jwt.utils.js";
import db from "../connection/db.connection.js";
export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.authToken;


    if (!token) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    try {
        const decoded = verifyToken(token);
        console.log(decoded);


        const query = "SELECT * FROM users WHERE id = ?;";
        db.query(query, [decoded], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Internal Server Error" });
            }

            if (result.length === 0) {
                return res.status(401).json({ message: "Unauthorized - User not found" });
            }

            req.user = result[0];

            next();
        });
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
};
