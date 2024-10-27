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
import { contactSchema, updateContactSchema } from '../validation/contacts.js';

const router = Router();

const jsonParser = express.json();

router.get('/', ctrlWrapper(getContactsCollection));

router.get('/:contactId', isValidID, ctrlWrapper(getContactsById));

router.post(
  '/',
  jsonParser,
  validateBody(contactSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/:contactId',
  jsonParser,
  isValidID,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

router.delete('/:contactId', isValidID, ctrlWrapper(deleteContactController));

export default router;
