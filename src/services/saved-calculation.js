// import { calculationSchema } from '@/validations/schemas/calculation-schema';
import { InputValidationError, NotFoundError } from '@/lib/errors';
import { calculationSchema } from '@/validations/schemas/calculation-schema';
import { nanoid } from 'nanoid';

export class SavedCalculationService {
  static async createSavedCalc({ userId, details }) {
    const generatedSavedCalcId = nanoid(8);

    const { error, value } = calculationSchema.validate(
      { details },
      { abortEarly: false }
    );

    if (error) {
      throw new InputValidationError(
        error.details.map((err) => err.message).join(', ')
      );
    }

    const savedCalculationData = await prisma.savedCalculation.create({
      data: {
        id: generatedSavedCalcId,
        userId,
        calculationDetails: {
          create: value.details.map((detail) => ({
            id: nanoid(8),
            materialId: detail.materialId,
            weight: detail.weight,
            calculatedCn: detail.calculatedCn,
          })),
        },
      },
    });

    return savedCalculationData;
  }

  static async getSavedCalculations(userId) {
    return await prisma.savedCalculation.findMany({
      where: {
        userId: userId,
      },
      include: {
        calculationDetails: true,
      },
    });
  }

  static async getSavedCalculationById(scid) {
    const savedCalculationData = await prisma.savedCalculation.findUnique({
      where: {
        id: scid,
      },
      include: {
        calculationDetails: true,
      },
    });

    if (!savedCalculationData) {
      throw new NotFoundError('Saved calculation is not found');
    }

    return savedCalculationData;
  }

  static async deleteSavedCalculation({ sessionUserId, scid }) {
    const findSavedCalculation = await prisma.savedCalculation.findUnique({
      where: {
        id: scid,
        userId: sessionUserId,
      },
    });

    if (!findSavedCalculation) {
      throw new NotFoundError('Saved calculation is not found');
    }

    await prisma.savedCalculation.delete({
      where: {
        id: scid,
      },
    });
  }
}
