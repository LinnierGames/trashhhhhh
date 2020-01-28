import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import indexRouter from "./routes/index";
import AuthRouter from "./routes/auth";
import passport from "passport";

// Fix this
// const dotenv = require("dotenv");
// dotenv.config({ path: path.join(__dirname, '../.env') });
// then read from process.env

var app = express();

// Database configuration ================================================================
mongoose.Promise = global.Promise;

const URI = "mongodb://localhost:27017/angela-backend-debug"
if (typeof URI !== 'undefined') {
  console.log("setup monogo")
  mongoose.connect(URI, { useNewUrlParser: true }, error => {
    if (error) { console.log(`Error connecting: ${error.message}`) }
    else { console.log('connected to mongoose') }
  });
} else {

  console.log("setup monogo: failed", process.env)
}

mongoose.set('debug', true);
mongoose.set('useCreateIndex', true);

// MIDDLEWARE configuration ==============================================================
app.use(bodyParser.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.use('/', indexRouter);

const authRouter = new AuthRouter(passport).getRouter();
app.use('/auth', authRouter);

export default app;