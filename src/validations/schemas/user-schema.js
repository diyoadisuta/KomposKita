import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }),
  firstName: Joi.string().max(35).label('firstName').required(),
  lastName: Joi.string().max(35),
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
