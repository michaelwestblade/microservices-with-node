import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_KEY = process.env.JWT_KEY || '';

router.get('/api/users/currentuser', (req, res) => {
  if (!req?.session?.jwt) {
    return res.send({currentUser: null});
  }

  try {
    const payload = jwt.verify(req.session.jwt, JWT_KEY);

    return res.send({currentUser: payload});
  } catch ( error ) {
    console.log(error);
    return res.send({currentUser: null});
  }
});

export {router as currentUserRouter};
