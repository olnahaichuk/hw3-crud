import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import express from 'express';
import {
  getContactsCollection,
  getContactsById,
  createContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { isValidID } from '../middlewars/isValidID.js';
import { validateBody } from '../middlewars/validateBody.js';
import { contactSchema } from '../validation/contacts.js';

const router = Router();

const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getContactsCollection));

router.get('/contacts/:contactId', isValidID, ctrlWrapper(getContactsById));

router.post(
  '/contacts',
  jsonParser,
  validateBody(contactSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/contacts/:contactId',
  jsonParser,
  isValidID,
  ctrlWrapper(patchContactController),
);

router.delete(
  '/contacts/:contactId',
  isValidID,
  ctrlWrapper(deleteContactController),
);

export default router;
