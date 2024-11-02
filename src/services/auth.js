import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import { sendEmail } from '../utils/sendMail.js';
import { env } from '../utils/env.js'
import { SMTP } from '../constants/index.js';



export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });
  if (user !== null) {
    throw createHttpError(409, 'Email in use');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  return await User.create({
    ...payload,
    password: encryptedPassword,
  });
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (user === null) {
    createHttpError(404, 'User not found');
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch !== true) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  await Session.deleteOne({ userId: user._id });

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}

export function logoutUser(sessionId) {
  return Session.deleteOne({ _id: sessionId });
}

export async function refreshSession(sessionId, refreshToken) {
  const session = await Session.findById(sessionId);
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw createHttpError(401, 'Session not found');
  }
  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Refresh token is expired');
  }
  await Session.deleteOne({
    _id: session._id,
  });

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
}

export async function requestResetToken (email){
  const user = await User.findOne({email});
  if(!user){
    throw createHttpError(404, 'User not found');
  }
  
const resetToken = jwt.sign({
  sub:user._id,
  email,
},
process.env.JWT_SECRET,
{
  expiresIn:'5min',
});
console.log(resetToken);
try {
  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to:email,
    subject:'Reset your password',
    html:`<p>Click <a href="https:/localhost:3000/reset-password/token=${resetToken}
    }">here</a> to reset your password!</p> `
  })
} catch (error) {
  console.error(error);
  throw createHttpError(500 , 'Cannot sent email')
  
}
}

export async function resetPassword(password, token ){
  try {
   const decoded = jwt.verify(token, process.env.JWT_SECRET) ;
   const user = await User.findOne({_id:decoded.sub,email:decoded.email});
    console.log(user);
    
   if(user === null){
    throw createHttpError(404, 'User not found');
   }
   const hashedPassword = await bcrypt.hash(password, 10);
   await User.findByIdAndUpdate(user._id, {password:hashedPassword});

  } catch (error) {
  if(error.name === "JsonWebTokenError" || error.name === "TokenExpiredError"){
    throw createHttpError(401, 'Token is expired or invalid.')
  }
    throw error ; 
  }
  
  
}