import express from "express";
import { Register } from "../controller/signup.controller.js";
const authRouter = express.Router();

authRouter.post("/", Register);



export default authRouter;
