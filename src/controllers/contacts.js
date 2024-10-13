import { ContactCollection } from '../db/models/contact.js';
import createHttpErrors from 'http-errors';
import {
  createContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';

export const getContactsCollection = async (req, res) => {
  const contacts = await ContactCollection.find();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactsById = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await ContactCollection.findById(contactId);
  console.log('Contact:', contact);
  if (!contact) {
    throw createHttpErrors(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  res.send('Create user');
  const contact = await createContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);

  if (!result) {
    next(createHttpErrors(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact',
    data: result.contact,
  });
};
export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);
  if (!contact) {
    next(createHttpErrors(404, 'Contact not found'));
  }
  res.status(204).send();
};
