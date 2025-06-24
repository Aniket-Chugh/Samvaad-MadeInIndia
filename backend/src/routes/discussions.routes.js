import express from "express";
import {
    getAllDiscussions,
    createDiscussion,
    getDiscussionById,
    addCommentToDiscussion
} from "../controller/discussions.controller.js";

const router = express.Router();

router.get("/", getAllDiscussions);
router.post("/", createDiscussion);
router.get("/:id", getDiscussionById);
router.post("/:id/comments", addCommentToDiscussion);

export default router;
