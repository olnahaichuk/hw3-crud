import express from 'express';
import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerController,
  loginController,
  logoutController,
  refreshController,
  requestResetEmailController,
  resetPasswordController,
  getOAuthURLController,
  confirmOAuthController
} from '../controllers/auth.js';
import { validateBody } from '../middlewars/validateBody.js';
import {
  registerSchema,
  loginSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
  confirmOAuthSchema
} from '../validation/auth.js';

const router = Router();
const jsonParser = express.json();

router.post(
  '/register',
  jsonParser,
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

router.post(
  '/login',
  jsonParser,
  validateBody(loginSchema),
  ctrlWrapper(loginController),
);


router.post('/logout', ctrlWrapper(logoutController));

router.post('/refresh', ctrlWrapper(refreshController));

router.post(
  '/send-reset-email',jsonParser,
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.post('/reset-pwd',jsonParser, validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));

router.get('/get-oauth-url',  ctrlWrapper(getOAuthURLController));

router.post('/confirm-oauth',jsonParser,validateBody(confirmOAuthSchema),ctrlWrapper(confirmOAuthController));

export default router;