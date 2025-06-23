import express from "express";
import { complaint } from "../controller/report.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.middleware.js";
const Reportrouter = express.Router();

Reportrouter.post("/", authMiddleware, complaint);


export default Reportrouter;
