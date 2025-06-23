import db from "../connection/db.connection.js";

export const voteComplaint = (req, res) => {
    const { complaint_id, type } = req.body;

    if (!["upvote", "downvote"].includes(type)) {
        return res.status(400).json({ error: "Invalid vote type" });
    }

    const query = `
    UPDATE complaints
    SET ${type} = ${type} + 1
    WHERE id = ?
  `;

    db.query(query, [complaint_id], (err, result) => {
        if (err) {
            console.error("❌ Vote Error:", err);
            return res.status(500).json({ error: "Vote failed" });
        }
        res.status(200).json({ message: `✅ ${type} recorded` });
    });
}
