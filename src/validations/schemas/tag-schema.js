import Joi from 'joi';

export const tagSchema = Joi.object({
  name: Joi.string().required(),
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
  });
