import {
  AuthorizationError,
  InputValidationError,
  NotFoundError,
} from '@/lib/errors';
import prisma from '@/lib/prisma';
import { commentSchema } from '@/validations/schemas/comment-schema';
import { nanoid } from 'nanoid';

export class CommentService {
  static async createComment({
    id,
    userId,
    userName,
    parentId = null,
    message,
  }) {
    const generatedId = nanoid(8);

    const findPost = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!findPost) {
      throw new NotFoundError('Post is not found');
    }

    const { error, value } = commentSchema.validate({ message });

    if (error) {
      throw new InputValidationError(error.details[0].message);
    }

    const commentData = await prisma.comment.create({
      data: {
        id: generatedId,
        postId: id,
        author: userName,
        userId,
        parentId,
        ...value,
      },
    });

    return {
      id: commentData.id,
      author: commentData.author,
      message: commentData.message,
      createdAt: commentData.createdAt,
    };
  }

  static async getPostComments(id) {
    const findPost = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!findPost) {
      throw new NotFoundError('Post is not found');
    }

    const postCommentsData = await prisma.comment.findMany({
      where: {
        postId: id,
        deletedAt: null,
      },
      select: {
        id: true,
        author: true,
        message: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return postCommentsData;
  }

  static async getCommentReplies({ id, cid }) {
    const commentRepliesData = await prisma.comment.findUnique({
      where: {
        id: cid,
        postId: id,
      },
      select: {
        id: true,
        author: true,
        message: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!commentRepliesData) {
      throw new NotFoundError('Comment is not found');
    }

    return commentRepliesData;
  }

  static async updatePostComment({ id, cid, sessionUserId, message }) {
    const findPostComment = await prisma.comment.findUnique({
      where: {
        id: cid,
        postId: id,
        userId: sessionUserId,
      },
    });

    if (!findPostComment) {
      throw new NotFoundError('Comment is not found');
    }

    const { error, value } = commentSchema.validate({ message });

    if (error) {
      throw new InputValidationError(error.details[0].message);
    }

    await prisma.comment.update({
      where: {
        id: cid,
      },
      data: {
        ...value,
      },
    });
  }

  static async deletePostComment({ id, cid, sessionUserId }) {
    const findPostComment = await prisma.comment.findUnique({
      where: {
        id: cid,
        postId: id,
        userId: sessionUserId,
      },
    });

    if (!findPostComment) {
      throw new NotFoundError('Comment is not found');
    }

    await prisma.comment.update({
      where: {
        id: cid,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
