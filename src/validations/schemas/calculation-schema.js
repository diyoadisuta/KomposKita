import Joi from 'joi';

export const calculationSchema = Joi.object({
  details: Joi.array().items(
    Joi.object({
      materialId: Joi.string().label('materialId').required(),
      weight: Joi.number().precision(10).label('weight').required(),
      calculatedCn: Joi.number().precision(10).label('calculatedCn').required(),
    })
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
    'number.base': '{#label} must be a number',
  });
