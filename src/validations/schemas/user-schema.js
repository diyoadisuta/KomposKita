import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }),
  fullName: Joi.string().max(35).label('fullName').required(),
  password: Joi.string().pattern(
    new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)[A-Za-z0-9]{8,}$')
  ),
})
  .options({
    errors: {
      wrap: {
        label: false,
      },
    },
  })
  .messages({
    'string.empty': '{#label} is required',
    'string.email': 'Invalid email',
    'string.pattern.base':
      'Password requires at least one uppercase and one lowercase, no special character',
  });

export const loginSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }),
  password: Joi.string(),
})
  .options({
    errors: {
      wrap: {
        label: false,
      },
    },
  })
  .messages({
    'string.empty': '{#label} is required',
    'string.email': 'Invalid email',
  });
