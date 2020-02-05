import * as express from "express";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import logger from "morgan";
import methodOverride from 'method-override';
import morgan from 'morgan';
import path from "path";

export default (app: express.Express) => {
  app.use(bodyParser.json({ limit: '2mb' }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.urlencoded({ extended: false }));
  app.use(logger('dev'));
  app.use(methodOverride('_method'));
  app.use(morgan('dev'));
}
