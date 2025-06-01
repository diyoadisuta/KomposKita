import prisma from '@/lib/prisma';
import { InputValidationError, NotFoundError } from '@/lib/errors';
import { calculationSchema } from '@/validations/schemas/calculation-schema';
import { nanoid } from 'nanoid';
import select from 'flyonui/components/select';

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

    return {
      id: savedCalculationData.id,
      createdAt: savedCalculationData.id,
    };
  }

  static async getSavedCalculations(userId) {
    const savedData = await prisma.savedCalculation.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        createdAt: true,
        calculationDetails: {
          select: {
            materialId: true,
            weight: true,
            calculatedCn: true,
            material: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return savedData.map((calc) => ({
      id: calc.id,
      createdAt: calc.createdAt,
      calculationDetails: calc.calculationDetails.map((detail) => ({
        name: detail.material.name, 
        weight: detail.weight,
        calculatedCn: detail.calculatedCn,
      })),
    }));
  }

  static async getSavedCalculationById(scid) {
    const savedCalculationData = await prisma.savedCalculation.findUnique({
      where: {
        id: scid,
      },
      select: {
        id: true,
        createdAt: true,
        calculationDetails: {
          select: {
            materialId: true,
            weight: true,
            calculatedCn: true,
          },
        },
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
