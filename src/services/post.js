import {
  AuthorizationError,
  InputValidationError,
  NotFoundError,
} from '@/lib/errors';
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
      where: {
        deletedAt: null,
      },
      include: {
        tags: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  static async updatePost({ id, sessionUserId, title, description, tagId }) {
    const findPost = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!findPost) {
      throw new NotFoundError('Post is not found');
    }

    if (findPost.userId !== sessionUserId) {
      throw new AuthorizationError('You dont have permission');
    }

    const { error, value } = postSchema.validate({ title, description });

    if (error) {
      throw new InputValidationError(error.details[0].message);
    }

    await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        ...value,
        tags: {
          connect: {
            id: tagId,
          },
        },
      },
    });
  }

  // TODO: For repeatable code like findpost should refactor later to independent function
  static async deletePost({ id, sessionUserId }) {
    const findPost = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!findPost) {
      throw new NotFoundError('Post is not found');
    }

    if (findPost.userId !== sessionUserId) {
      throw new AuthorizationError('You dont have permission');
    }

    // FE Scenario if user deleted post the comment wont erased but the post "This post deleted by authors"
    await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
