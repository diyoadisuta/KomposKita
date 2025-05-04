import Joi from 'joi';

export const postSchema = Joi.object({
  title: Joi.string().label('title').required(),
  description: Joi.string().label('description').required(),
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
