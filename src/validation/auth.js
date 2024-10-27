import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Contactname shouls be a string',
    'string.min': 'Contact should have at least 3 characters ',
    'string.max': 'Contact should have at most 20 characters',
    'any.required': 'Contactname is required!',
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).max(10).required().messages({
    'string.min': 'Password should have at least 8 characters',
    'string.max': 'Password should have at most 10 characters',
    'any.required': 'Password is required',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Email must be valid ',
  }),
  password: Joi.string().min(8).max(10).required().messages({
    'string.min': 'Password should have at least 8 characters',
    'string.max': 'Password should have at most 10 characters',
    'any.required': 'Password is required',
  }),
});
