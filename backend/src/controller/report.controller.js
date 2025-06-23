import db from "../connection/db.connection.js";
import {
    getPriorityFromGemini,
    checkImageAuthenticity,
} from "../controller/prioritycheck.controller.js";

export const complaint = async (req, res) => {

    const userId = req.user.id;

    try {
        const {
            title,
            description,
            category,
            image_url,
            latitude,
            longitude,
            location,
        } = req.body;

        if (!title || !description || !image_url) {
            return res
                .status(400)
                .json({ error: "Missing title, description, or image_url" });
        }

        const priority = await getPriorityFromGemini(title, description);
        const image_check = await checkImageAuthenticity(image_url, description);

        if (image_check !== "VALID") {
            return res.status(400).json({
                error: `❌ Complaint not submitted. Image check failed: ${image_check}`,
            });
        }


        console.log(title,
            description,
            category,
            image_url,
            latitude,
            longitude,
            location,
            priority,
            image_check,);


        const query = `
      INSERT INTO complaints
      (title, description, category, image_url, latitude, longitude, location, priority, image_status , user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? , ?)
    `;

        const values = [
            title,
            description,
            category,
            image_url,
            latitude,
            longitude,
            location,
            priority,
            image_check,
            userId
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("❌ DB Error:", err);
                return res.status(500).json({ error: "DB insert failed" });
            }

            res.status(200).json({
                message: "✅ Complaint submitted",
                complaint_id: result.insertId,
                priority,
                image_status: image_check,
            });
        });
    } catch (err) {
        console.error("❌ Gemini or Server Error:", err.message || err);
        res.status(500).json({ error: "Something went wrong in AI processing" });
    }
};
