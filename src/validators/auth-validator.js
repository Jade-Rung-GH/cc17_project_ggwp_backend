const Joi = require("joi");

exports.registerSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-z0-9_-]{3,15}$/)
    .required(),

  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{6,}$/) // /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]){8,}$/
    .required(),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().strip(),

  phone: Joi.string()
    .allow("")
    .optional()
    .pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/),

  email: Joi.string().required().email({ tlds: false }),
});

exports.loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
