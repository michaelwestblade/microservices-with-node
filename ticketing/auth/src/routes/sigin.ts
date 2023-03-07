import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import {validateRequest} from '../middlewares/validate-request';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_KEY = process.env.JWT_KEY || '';

router.post('/api/users/signin', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('Password is required'),
], validateRequest, async (req: Request, res: Response) => {
  const {email, password} = req.body;

  const existingUser = await User.findOne({email});

  if (!existingUser) {
    console.log('No user found');
    throw new BadRequestError('Login request failed');
  }

  const passwordMatches = await Password.compare(existingUser.password, password);
  
  if (!passwordMatches) {
    console.log('Password mismatch');
    throw new BadRequestError('Login request failed');
  }

  // generate jwt
  const userJwt = jwt.sign({
    id: existingUser.id,
    email: existingUser.email
  }, JWT_KEY);

  // store it on session object
  req.session = {
    jwt: userJwt
  };

  res.status(201).send(existingUser);
});


export {router as signInRouter};
