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
    const generatedId = nanoid(8);
    const { error, value } = postSchema.validate({ title, description });

    if (error) {
      throw new InputValidationError(error.details[0].message);
    }

    const postData = await prisma.post.create({
      data: {
        id: generatedId,
        userId: userId,
        ...value,
        tags: {
          connect: {
            id: tagId,
          },
        },
      },
    });

    return {
      id: postData.id,
      title: postData.title,
      description: postData.description,
      createdAt: postData.createdAt,
    };
  }

  static async getPosts() {
    const postsData = await prisma.post.findMany({
      include: {
        tags: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return postsData.map(
      ({
        id,
        userId,
        title,
        description,
        tags,
        user,
        createdAt,
        updatedAt,
      }) => ({
        id,
        userId,
        author: user.fullName,
        title,
        description,
        tag: tags[0].name,
        createdAt,
        updatedAt,
      })
    );
  }

  static async getPostById(id) {
    const postData = await prisma.post.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        userId: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        user: {
          select: {
            fullName: true,
          },
        },
      },
    });

    if (!postData) {
      throw new NotFoundError('Post is not found');
    }

    return {
      id: postData.id,
      userId: postData.userId,
      author: postData.user.fullName,
      title: postData.title,
      description: postData.description,
      createdAt: postData.createdAt,
      updatedAt: postData.updatedAt,
      deletedAt: postData.deletedAt,
    };
  }

  static async getUserPosts(userId) {
    const userPostsData = await prisma.post.findMany({
      where: {
        deletedAt: null,
        userId: userId,
      },
      include: {
        tags: {
          select: {
            name: true,
          },
        },
      },
    });

    return userPostsData.map(
      ({ id, title, description, tags, createdAt, updatedAt }) => ({
        id,
        title,
        description,
        tag: tags[0].name,
        createdAt,
        updatedAt,
      })
    );
  }

  static async updatePost({ id, sessionUserId, title, description }) {
    const findPost = await prisma.post.findUnique({
      where: {
        id: id,
        userId: sessionUserId,
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
      data: {
        ...value,
      },
    });
  }

  static async deletePost({ id, sessionUserId }) {
    const findPost = await prisma.post.findUnique({
      where: {
        id: id,
        userId: sessionUserId,
      },
    });

    if (!findPost) {
      throw new NotFoundError('Post is not found');
    }

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
