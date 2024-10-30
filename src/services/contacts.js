import { ContactCollection } from '../db/models/contact.js';

export const getContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
  userId,
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactQuery = ContactCollection.find();
  if (filter.type !== undefined) {
    return contactQuery.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite !== undefined) {
    return contactQuery.where('isFavourite').equals(filter.isFavourite);
  }

  contactQuery.where('userId').equals(userId);

  const [total, contacts] = await Promise.all([
    ContactCollection.countDocuments(contactQuery),
    contactQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(total / perPage);
  return {
    data: contacts,
    page,
    perPage,
    totalItems: total,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: totalPages - page > 0,
  };
};

export const createContact = async (payload) => {
  const contact = await ContactCollection.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload, userId) => {
  const rawResult = await ContactCollection.findOneAndUpdate(
    {
      _id: contactId,
      userId: userId
    },
    payload,
    {
      new: true,
      includeResultMetadata: true,
    },
  );
  if (!rawResult || !rawResult.value) return null;
  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactId,userId) => {
  const contact = await ContactCollection.findOneAndDelete({
    _id: contactId,
    userId:userId,
  });
  return contact;
};
