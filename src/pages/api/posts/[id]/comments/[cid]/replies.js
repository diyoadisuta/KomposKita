import { auth } from '@/lib/auth';
import { NotFoundError } from '@/lib/errors';
import { CommentService } from '@/services/comment';

export default async function handler(req, res) {
  const { id, cid } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const session = await auth.api.getSession({
          headers: req.headers,
        });

        if (!session) {
          return res
            .status(401)
            .json({ success: false, message: 'Please login first' });
        }

        const commentRepliesData = await CommentService.getCommentReplies({
          id,
          cid,
        });
        res.status(200).json({
          success: true,
          message: 'Comment replies is fetched successfully',
          data: commentRepliesData,
        });
      } catch (error) {
        console.error('GETcommentreplies: error', error);

        if (error instanceof NotFoundError) {
          return res
            .status(404)
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
