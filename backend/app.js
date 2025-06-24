import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./src/connection/db.connection.js";
import Reportrouter from "./src/routes/report.route.js";
import Voterouter from "./src/routes/vote.route.js";
import authRouter from "./src/routes/Registerauth.route.js";
import { authMiddleware } from "./src/middleware/authMiddleware.middleware.js";
import discussionRoutes from "./src/routes/discussions.routes.js";



const app = express();
const port = 3000;

// Middleware
app.use(cors({
    origin: "http://localhost:5173", // ✅ your frontend origin
    credentials: true,              // ✅ allow cookies / tokens via CORS
})); app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(cookieParser());

// Root route
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Routes
app.use("/report", Reportrouter);
app.use("/voting", Voterouter);
app.use("/signup", authRouter);
app.use("/discussions", discussionRoutes);


app.get("/api/me", authMiddleware, (req, res) => {
    res.json({
        success: true,
        user: req.user,
    });
});

app.get("/currentusercomplaints", authMiddleware, (req, res) => {
    const userId = req.user.id;
    console.log("User ID:", userId);

    const query = `
    SELECT *
    FROM complaints
    WHERE user_id = ?
    ORDER BY upvote DESC, downvote ASC
  `;

    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error("❌ DB error in /currentusercomplaints:", err);
            return res.status(500).json({ error: "DB error" });
        }
        res.json(result);
    });
});


app.post("/update", authMiddleware, async (req, res) => {
    const id = req.user.id;
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }

    try {
        const [result] = await db.promise().query(
            "UPDATE users SET name = ?, email = ? WHERE id = ?",
            [name, email, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.json({ message: "Complaint updated successfully!" });
    } catch (error) {
        console.error("Update error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get("/profile", authMiddleware, (req, res) => {
    const userId = req.user;
    res.send(userId)
});
app.post("/trending", authMiddleware, (req, res) => {
    const { location } = req.body;

    if (!location) {
        return res.status(400).json({ error: "Location is required" });
    }

    const query = `
    SELECT *,
      (upvote - downvote) AS score,
      CASE WHEN (upvote - downvote) < 0 THEN 'fake' ELSE 'valid' END AS status
    FROM complaints
    WHERE (upvote - downvote) > 0 AND location LIKE ?
    ORDER BY score DESC
    LIMIT 10;
  `;

    db.query(query, [`%${location}%`], (err, result) => {
        if (err) {
            console.error("❌ DB error in /trending:", err);
            return res.status(500).json({ error: "DB error" });
        }
        res.json(result);
    });
});




app.post("/bydistrict", authMiddleware, (req, res) => {
    const { location } = req.body;
    const userName = req.user.name;
    console.log("📍 District requested:", location);

    if (!location) {
        return res.status(400).json({ error: "District is required" });
    }

    const query = `
    SELECT *,
      (upvote - downvote) AS score,
      CASE WHEN (upvote - downvote) < 0 THEN 'fake' ELSE 'valid' END AS status
    FROM complaints
    WHERE location = ?
    ORDER BY score DESC, downvote ASC
  `;

    db.query(query, [location], (err, results) => {
        if (err) {
            console.error("❌ DB error in /bydistrict:", err);
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        res.json({
            user: userName,
            complaints: results,
        });
    });
});



// Server start
app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});
