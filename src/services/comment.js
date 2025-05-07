import {
  AuthorizationError,
  InputValidationError,
  NotFoundError,
} from '@/lib/errors';
import prisma from '@/lib/prisma';
import { commentSchema } from '@/validations/schemas/comment-schema';
import { nanoid } from 'nanoid';

export class CommentService {
  //id is postId, trying to use postId but error occurs, fix it
  static async createComment({ id, userId, parentId = null, message }) {
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
        userId,
        parentId,
        ...value,
      },
    });

    return;
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

    return await prisma.comment.findMany({
      where: {
        postId: id,
        deletedAt: null,
      },
    });
  }

  static async getCommentReplies(cid) {
    return await prisma.comment.findMany({
      where: {
        parentId: cid,
      },
    });
  }

  static async updatePostComment({ cid, sessionUserId, message }) {
    const findPostComment = await prisma.comment.findUnique({
      where: {
        id: cid,
      },
    });

    if (!findPostComment) {
      throw new NotFoundError('Comment is not found');
    }

    if (findPostComment.userId !== sessionUserId) {
      throw new AuthorizationError('You dont have permission');
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

  static async deletePostComment({ cid, sessionUserId }) {
    const findPostComment = await prisma.comment.findUnique({
      where: {
        id: cid,
      },
    });

    if (!findPostComment) {
      throw new NotFoundError('Comment is not found');
    }

    if (findPostComment.userId !== sessionUserId) {
      throw new AuthorizationError('You dont have permission');
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
