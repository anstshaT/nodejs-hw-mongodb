import Joi from 'joi';

/* REGISTER VALIDATION */

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

/* LOGIN VALIDATION */

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
