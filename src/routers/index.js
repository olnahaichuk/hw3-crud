import { Router } from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';
import { auth } from '../middlewars/auth.js';

const router = Router();

router.use('/contacts', auth, contactsRouter);
router.use('/auth', authRouter);

export default router;
