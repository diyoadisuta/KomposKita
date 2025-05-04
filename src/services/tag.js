import {
  InputValidationError,
  NotFoundError,
  PrismaCustomError,
} from '@/lib/errors';
import prisma from '@/lib/prisma';
import { tagSchema } from '@/validations/schemas/tag-schema';
import { nanoid } from 'nanoid';

export class TagService {
  static async createTag({ name }) {
    const generatedId = nanoid(10);
    const { error, value } = tagSchema.validate({ name });

    if (error) {
      throw new InputValidationError(error.details[0].message);
    }

    const isTagExisted = await prisma.tag.findUnique({
      where: {
        name: name,
      },
    });

    if (isTagExisted) {
      throw new PrismaCustomError('Tag already existed');
    }

    const tagData = await prisma.tag.create({
      data: {
        id: `tag-${generatedId}`,
        ...value,
      },
    });

    return tagData;
  }

  static async getTags() {
    return await prisma.tag.findMany();
  }

  static async getTagById(id) {
    const tagData = await prisma.tag.findUnique({
      where: {
        id: id,
      },
    });

    if (!tagData) {
      throw new NotFoundError('Tag is not found');
    }

    return tagData;
  }

  static async updateTag({ id, name }) {
    const findTag = await prisma.tag.findUnique({
      where: {
        id: id,
      },
    });

    if (!findTag) {
      throw new NotFoundError('Tag is not found');
    }

    const { error, value } = tagSchema.validate({ name });

    if (error) {
      throw new InputValidationError(error.details[0].message);
    }

    const isTagExisted = await prisma.tag.findUnique({
      where: {
        name: name,
      },
    });

    if (isTagExisted) {
      throw new PrismaCustomError('Tag already existed');
    }

    await prisma.tag.update({
      where: {
        id: id,
        data: {
          ...value,
        },
      },
    });
  }

  static async deleteTag(id) {
    const findTag = await prisma.tag.findUnique({
      where: {
        id: id,
      },
    });

    if (!findTag) {
      throw new NotFoundError('Tag is not found');
    }

    // TODO: SET ONLY NO POST CONNECTED TO RELATED TAGS THAT CAN BE DELETED
    const findConnectedPosts = await prisma.tag.findMany({
      include: {
        posts: true,
      },
    });

    console.log(findConnectedPosts)

    if (findConnectedPosts.posts) {
      throw new PrismaCustomError('There is post associated with this tag');
    }

    await prisma.tag.delete({
      where: {
        id: id,
      },
    });
  }
}
