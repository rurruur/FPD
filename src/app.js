import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import './db';
import * as router from './routers/routes';

const app = express();
const logger = morgan('dev');

app.set('views', process.cwd() + '/src/views');
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: false }));
app.use(logger);
app.use(session({
	secret: process.env.COOKIE_SECRET,
	resave: false,
	saveUninitialized: false,
	store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
}));
app.use('/static', express.static('assets'));
app.use(router.path, router.router);

app.listen(process.env.PORT, () => console.log(`🚀 Server listening on http://localhost:${process.env.PORT}`));