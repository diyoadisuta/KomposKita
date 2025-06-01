import { nanoid } from 'nanoid';
import prisma from '@/lib/prisma';
import { materialSchema } from '@/validations/schemas/material-schema';
import {
  InputValidationError,
  NotFoundError,
  PrismaCustomError,
} from '@/lib/errors';

export class MaterialService {
  static async createMaterial({ name, carbon, nitrogen, category }) {
    const generatedId = nanoid(8);
    const { error, value } = materialSchema.validate({
      name,
      carbon,
      nitrogen,
      category,
    });

    if (error) {
      throw new InputValidationError(error.details[0].message);
    }

    // Note: prisma error instance can't be catch (always return false), look like it's bug many people encounter it, so i created custom one
    const isMaterialExisted = await prisma.material.findUnique({
      where: {
        name: name,
      },
    });

    if (isMaterialExisted) {
      throw new PrismaCustomError('Material already existed');
    }

    const materialData = await prisma.material.create({
      data: {
        id: generatedId,
        ...value,
      },
    });

    return {
      id: materialData.id,
      name: materialData.name,
      carbon: materialData.carbon,
      nitrogen: materialData.nitrogen,
      category: materialData.category,
      createdAt: materialData.createdAt,
    };
  }

  static async getMaterials() {
    return await prisma.material.findMany({
      select: {
        id: true,
        name: true,
        carbon: true,
        nitrogen: true,
        category: true,
      },
    });
  }

  static async getMaterialById(id) {
    const materialData = await prisma.material.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        carbon: true,
        nitrogen: true,
        category: true,
      },
    });

    if (!materialData) {
      throw new NotFoundError('Material is not exist');
    }

    return materialData;
  }

  static async updateMaterial({ id, name, carbon, nitrogen, category }) {
    const findMaterial = await prisma.material.findUnique({
      where: {
        id: id,
      },
    });

    if (!findMaterial) {
      throw new NotFoundError('Material is not found');
    }

    const { error, value } = materialSchema.validate({
      name,
      carbon,
      nitrogen,
      category,
    });

    if (error) {
      throw new InputValidationError(error.details[0].message);
    }

    await prisma.material.update({
      where: {
        id: id,
      },
      data: {
        ...value,
      },
    });
  }

  static async deleteMaterial(id) {
    const findMaterial = await prisma.material.findUnique({
      where: {
        id: id,
      },
    });

    if (!findMaterial) {
      throw new NotFoundError('Material is not found');
    }

    await prisma.material.delete({
      where: {
        id: id,
      },
    });
  }
}
