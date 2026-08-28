 import jwt from 'jsonwebtoken';

import { JWT_EXPIRY, JWT_SECRET } from '../../configs/serverConfig.js';
 export const createJWT = (payload) => {
   return jwt.sign(payload, JWT_SECRET, {
     expiresIn: JWT_EXPIRY
   });
 };