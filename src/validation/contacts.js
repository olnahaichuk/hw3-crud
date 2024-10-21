import Joi from 'joi';

export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Contactname shouls be a string',
    'string.min': 'Contact should have at least 3 characters ',
    'string.max': 'Contact should have at most 20 characters',
    'any.required': 'Contactname is required!',
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'any.required': 'PhoneNumber is required!',
    'string.min': 'PhoneNumber should have at least 3 characters!',
    'string.max': 'PhoneNumber should have at most 20 characters!',
  }),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'any.required': 'Contact Type is required!',
    }),
});
