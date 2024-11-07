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
import { env } from '../utils/env.js';

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
  const photo = req.file ; 
  let photoURL;
   
  if(photo){

    if(env("ENABLE_CLOUDINARY") === "true"){
       const result = await uploadToCloudinary(photo.path);
      photoURL = result.secure_url || result.url;
     await fs.unlink(photo.path);

    }else{
     photoURL =  await saveFileToUploadDir(photo);
    }
  }
  
  const contact = await createContact({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
    userId: req.user.id,
    photo:photoURL,
  });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  console.log(req.params);
  
  const { contactId } = req.params;
console.log(contactId);
console.log(req.file);

  const photo = req.file;

  let photoURL;

  if(photo){

    if(env("ENABLE_CLOUDINARY") === "true"){
       const result = await uploadToCloudinary(photo.path);
      photoURL = result.secure_url || result.url;
     await fs.unlink(photo.path);

    }else{
     photoURL =  await saveFileToUploadDir(photo);
    }
  }
  
  const result = await updateContact(contactId, {
    ...req.body, 
    photo: photoURL,
  },req.user.id);
 
  console.log(result);
  

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
