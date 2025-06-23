import db from "../connection/db.connection.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt.utils.js";
import cokkieOptions from "../config/cookieOption.config.js";

export const Register = (req, res) => {
    const userId = uuidv4();
    const saltRounds = 10;

    const {
        name,
        email,
        phone,
        password,
        address,
        city,
        state,
        pincode,
        profile_photo,
        latitude,
        longitude,
    } = req.body;

    const query = `
    INSERT INTO users (
      id, name, email, phone, password, address,
      city, state, pincode, latitude, longitude, profile_photo
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            console.error("❌ Error generating salt:", err);
            return res.status(500).json({ error: "Server error during salt generation" });
        }

        bcrypt.hash(password, salt, (err, hashedPassword) => {
            if (err) {
                console.error("❌ Error hashing password:", err);
                return res.status(500).json({ error: "Server error during password hashing" });
            }

            const values = [
                userId,
                name,
                email,
                phone,
                hashedPassword,
                address,
                city,
                state,
                pincode,
                latitude,
                longitude,
                profile_photo,
            ];

            db.query(query, values, async (err, result) => {
                if (err) {
                    console.error("❌ DB error while registering user:", err);
                    return res.status(500).json({ error: "Database error" });
                }

                const token = await signToken({ userId });
                res.cookie("authToken", token, cokkieOptions);

                res.status(201).json({
                    message: "✅ Registration successful",
                    userId,
                    token,
                });
            });
        });
    });
};
