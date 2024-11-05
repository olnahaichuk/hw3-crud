import fs from 'node:fs/promises';
import path from 'node:path';
import createHttpErrors from 'http-errors';
import {
  createContact,
  deleteContact,
  getContacts,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { ContactCollection } from '../db/models/contact.js';
import {uploadToCloudinary} from '../utils/uploadToCloudinary.js'
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

export const getContactsCollection = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user.id,
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactsById = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await ContactCollection.findOne({ _id: contactId, userId: req.user.id });

  if (!contact) {
    throw createHttpErrors(404, 'Contact not found');
  }

  if (
    !contact ||
    !contact.userId ||
    contact.userId.toString() !== req.user.id.toString()
  ) {
    return next(new createHttpErrors(404, 'Contact not found'));
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  let photo = null ; 

  if(typeof req.file !== 'undefined'){

    if(process.env.ENABLE_CLOUDINARY === "true"){
     const result = await uploadToCloudinary(req.file.path);
     await fs.unlink(req.file.path);

    }else{

      await fs.rename(req.file.path, path.resolve('src', 'public/photos', req.file.filename) );
   photo = `${env('APP_DOMAIN')}/uploads/${req.file.filename}`
    }
  }
  
  const contact = await createContact({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
    userId: req.user.id,
    photo,
  });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const photo = req.file;
  console.log(photo);

  let photoURL;

  if(photo){
    photoURL = await saveFileToUploadDir(photo);
  }
  
  const result = await updateContact(contactId, {
    ...req.body, 
    photo: photoURL,
  });

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
  const contact = await deleteContact(contactId, req.user.id);
  console.log(contact);

  if (!contact) {
    next(createHttpErrors(404, 'Contact not found'));
    return;
  }
 
  res.status(204).send();
};
