import Joi from 'joi';

export const materialSchema = Joi.object({
  name: Joi.string().label('name').required(),
  carbon: Joi.number().precision(10).label('carbon').required(),
  nitrogen: Joi.number().precision(10).label('nitrogen').required(),
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
    'number.base': '{#label} must be a number',
  });
