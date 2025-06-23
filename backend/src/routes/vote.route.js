import express from "express";
import { voteComplaint } from "../controller/voteReport.controller.js";
import {authMiddleware} from "../middleware/authMiddleware.middleware.js";
const VoteRouter = express.Router();

VoteRouter.post("/", authMiddleware, voteComplaint);

export default VoteRouter;
