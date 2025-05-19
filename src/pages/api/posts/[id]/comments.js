import { auth } from '@/lib/auth';
import { InputValidationError, NotFoundError } from '@/lib/errors';
import { CommentService } from '@/services/comment';

export default async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case 'POST':
      const { message, parentId } = req.body;

      try {
        const session = await auth.api.getSession({
          headers: req.headers,
        });

        if (!session) {
          return res
            .status(401)
            .json({ success: false, message: 'Please login first' });
        }

        const commentData = await CommentService.createComment({
          id,
          userId: session.user.id,
          userName: session.user.name,
          parentId,
          message,
        });
        res.status(201).json({
          success: true,
          message: 'Comment is created successfully',
          data: commentData,
        });
      } catch (error) {
        console.error('POSTcomment: error:', error);

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

        res
          .status(500)
          .json({ success: false, message: 'Something went wrong' });
      }
      break;

    case 'GET':
      try {
        const commentData = await CommentService.getPostComments(id);
        res.status(200).json({
          success: true,
          message: 'Comments is fetched successfully',
          data: commentData,
        });
      } catch (error) {
        console.error('GETcomments: error', error);

        if (error instanceof NotFoundError) {
          return res
            .status(404)
            .json({ success: false, message: error.message });
        }

        res
          .status(500)
          .json({ success: false, message: 'Something went wrongs' });
      }
      break;

    default:
      res.status(404).json({
        success: false,
        message: `This url cannot be accessed by ${req.method} method`,
      });
      break;
  }
}
