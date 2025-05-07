import Joi from 'joi';

export const commentSchema = Joi.object({
  message: Joi.string().required(),
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
