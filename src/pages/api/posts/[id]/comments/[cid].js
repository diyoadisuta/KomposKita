import { auth } from '@/lib/auth';
import {
  AuthorizationError,
  InputValidationError,
  NotFoundError,
} from '@/lib/errors';
import { CommentService } from '@/services/comment';

export default async function handler(req, res) {
  const { id, cid } = req.query;

  switch (req.method) {
    case 'PUT':
      const { message } = req.body;

      try {
        const session = await auth.api.getSession({
          headers: req.headers,
        });

        if (!session) {
          return res
            .status(401)
            .json({ success: false, message: 'Please login first' });
        }

        await CommentService.updatePostComment({
          id,
          cid,
          sessionUserId: session.user.id,
          message,
        });
        res
          .status(200)
          .json({ success: true, messsage: 'Comment is updated successfully' });
      } catch (error) {
        console.error('PUTpostcomment: error', error);

        if (error instanceof NotFoundError) {
          return res
            .status(404)
            .json({ success: false, message: error.message });
        }

        if (error instanceof InputValidationError) {
          return res
            .status(400)
            .json({ success: false, message: error.message });
        }

        if (error instanceof AuthorizationError) {
          return res
            .status(403)
            .json({ success: false, message: error.message });
        }

        res
          .status(500)
          .json({ success: false, message: 'Something went wrong' });
      }
      break;

    case 'DELETE':
      try {
        const session = await auth.api.getSession({
          headers: req.headers,
        });

        if (!session) {
          return res
            .status(401)
            .json({ success: false, message: 'Please login first' });
        }

        await CommentService.deletePostComment({
          id,
          cid,
          sessionUserId: session.user.id,
        });
        res
          .status(200)
          .json({ success: true, message: 'Comment is deleted successfully' });
      } catch (error) {
        console.error('DELETEcomment: error:', error);

        if (error instanceof NotFoundError) {
          return res
            .status(404)
            .json({ success: false, message: error.message });
        }

        if (error instanceof AuthorizationError) {
          return res
            .status(403)
            .json({ success: false, message: error.message });
        }

        res
          .status(500)
          .json({ success: false, message: 'Something went wrong' });
      }
      break;

    default:
      res.status(405).json({
        success: false,
        message: `This url cannot be accessed by ${req.method} method`,
      });
      break;
  }
}
