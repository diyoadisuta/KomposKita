import { auth } from '@/lib/auth';
import { CommentService } from '@/services/comment';

export default async function handler(req, res) {
  const { cid } = req.query;
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

        const commentRepliesData = await CommentService.getCommentReplies(cid);
        res.status(200).json({
          success: true,
          message: 'Comment replies is fetched successfully',
          data: commentRepliesData,
        });
      } catch (error) {
        console.error('GETcommentreplies: error', error);

        res
          .status(500)
          .json({ success: false, message: 'Internal server error' });
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
