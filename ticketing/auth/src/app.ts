import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import {currentUserRouter} from './routes/current-user';
import {signInRouter} from './routes/sigin';
import {signOutRouter} from './routes/signout';
import {signUpRouter} from './routes/signup';
import {errorHandler} from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed:false,
  secure:true,

}))

app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
})

app.use(errorHandler);

export {app};
