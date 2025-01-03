import Joi from 'joi';

const registerUserValidation = Joi.object({
  role: Joi.string().valid('ADMIN', 'CUSTOMER', 'RECEPTIONIST').required(),
  name: Joi.string().max(200).required(),
  address: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  email: Joi.string().email().max(200).required(),
  password: Joi.string().max(200).required(),
});


const loginUserValidation = Joi.object({
  email: Joi.string().email().max(200).required(),
  password: Joi.string().max(200).required(),
});

const meValidation = Joi.string().email().max(200).required();

export { registerUserValidation, loginUserValidation, meValidation };