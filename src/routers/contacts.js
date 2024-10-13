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

const router = Router();

const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getContactsCollection));

router.get('/contacts/:contactId', ctrlWrapper(getContactsById));

router.post('/contacts', jsonParser, ctrlWrapper(createContactController));

router.patch(
  '/contacts/:contactId',
  jsonParser,
  ctrlWrapper(patchContactController),
);

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));


export default router;
