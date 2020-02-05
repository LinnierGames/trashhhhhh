const dotenv = require("dotenv");
dotenv.config();

import express from "express";
import passport from "passport";

import configureDatabase from "./config/database";
import configureMiddleware from "./config/middleware";

import AuthRouter from "./routes/auth";

var app = express();

configureDatabase();
configureMiddleware(app);

const authRouter = new AuthRouter(passport).getRouter();
app.use('/auth', authRouter);

export default app;