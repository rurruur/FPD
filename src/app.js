import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import './db';
import * as router from './routers/routes';
import { findAndLocalsUser } from './modules/middlewares';
import { errorHandler } from './modules/error';

const app = express();
const port = process.env.PORT | 4242

app.set('views', process.cwd() + '/src/views');
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(session({
	secret: process.env.COOKIE_SECRET,
	resave: false,
	saveUninitialized: false,
	store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
}));
app.use('/static', express.static('assets'));
app.use(findAndLocalsUser);
app.use((req, res, next) => {
	const { method, path, url, query, headers: { cookie }, body } = req;
	const request = { method, path, url, query, cookie, body };
	next();
});
app.use(router.path, router.router);
app.use(errorHandler);

app.listen(port, () => console.log(`🚀 Server listening on http://localhost:${port}`));