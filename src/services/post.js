import { InputValidationError, NotFoundError } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { postSchema } from '@/validations/schemas/post-schema';
import { nanoid } from 'nanoid';

export class PostService {
  static async createPost({ userId, title, description, tagId }) {
    const generatedId = nanoid(10);
    const { error, value } = postSchema.validate({ title, description });

    if (error) {
      throw new InputValidationError(error.details[0].message);
    }
    const postData = await prisma.post.create({
      data: {
        id: `post-${generatedId}`,
        userId: userId,
        ...value,
        tags: {
          connect: {
            id: tagId,
          },
        },
      },
    });

    return postData;
  }

  static async getPosts() {
    return await prisma.post.findMany({
      include: {
        tags: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  static async updatePost({ id, title, description }) {
    const findPost = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!findPost) {
      throw new NotFoundError('Post is not found');
    }

    const { error, value } = postSchema.validate({ title, description });

    if (error) {
      throw new InputValidationError(error.details[0].message);
    }

    await prisma.post.update({
      where: {
        id: id,
      },
      data: { ...value },
    });
  }
}
