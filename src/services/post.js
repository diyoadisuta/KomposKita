import {
  AuthorizationError,
  InputValidationError,
  NotFoundError,
} from '@/lib/errors';
import prisma from '@/lib/prisma';
import { postSchema } from '@/validations/schemas/post-schema';
import { nanoid } from 'nanoid';

export class PostService {
  static async createPost({ userId, userName, title, description, tagId }) {
    const generatedId = nanoid(8);
    const { error, value } = postSchema.validate({ title, description });

    if (error) {
      throw new InputValidationError(error.details[0].message);
    }

    const postData = await prisma.post.create({
      data: {
        id: generatedId,
        userId: userId,
        author: userName,
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

    return postsData.map(
      ({ id, author, title, description, tags, createdAt, updatedAt }) => ({
        id,
        author,
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
        author: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!postData) {
      throw new NotFoundError('Post is not found');
    }

    return postData;
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

  static async updatePost({ id, sessionUserId, title, description, tagId }) {
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
        tags: {
          connect: {
            id: tagId,
          },
        },
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
