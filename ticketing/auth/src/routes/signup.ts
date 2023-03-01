import express, {Request, Response} from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { User } from '../models/user';

const router = express.Router();

router.post('/api/users/signup', [
  body('email').isEmail().withMessage('email must be valid'),
  body('password').trim().isLength({min: 4, max: 20}).withMessage('password must be between 4 and 20 characters')
],async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  const { email, password } = req.body;

  const existingUser = await User.findOne({email});

  if (existingUser) {
    console.log(`Email in user: ${email}`);
    return res.send({});
  }

  const user = User.build(req.body);
  await user.save();

  res.status(201).send(user);
});

export {router as signUpRouter};