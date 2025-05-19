import { auth } from '@/lib/auth';
import {
  AuthorizationError,
  InputValidationError,
  NotFoundError,
} from '@/lib/errors';
import { PostService } from '@/services/post';

export default async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const postData = await PostService.getPostById(id);
        res.status(200).json({
          success: true,
          message: 'Post is fetched successfully',
          data: postData,
        });
      } catch (error) {
        console.error('GETpostbyid: error:', error);

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

    case 'PUT':
      const { title, description, tagId } = req.body;

      try {
        const session = await auth.api.getSession({
          headers: await req.headers,
        });

        if (!session) {
          return res
            .status(401)
            .json({ success: false, message: 'Please login first' });
        }

        await PostService.updatePost({
          id,
          sessionUserId: session.user.id,
          title,
          description,
          tagId,
        });

        res
          .status(200)
          .json({ success: true, message: 'Post is updated successfully' });
      } catch (error) {
        console.error('PUTpost: error:', error);

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

    case 'DELETE':
      try {
        const session = await auth.api.getSession({
          headers: await req.headers,
        });

        if (!session) {
          return res
            .status(401)
            .json({ success: false, message: 'Please login first' });
        }

        await PostService.deletePost({
          id,
          sessionUserId: session.user.id,
        });

        res
          .status(200)
          .json({ success: true, message: 'Post is deleted successfully' });
      } catch (error) {
        console.error('DELETEpost: error:', error);

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
