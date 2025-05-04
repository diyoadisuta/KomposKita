import { auth } from '@/lib/auth';
import { InputValidationError } from '@/lib/errors';
import { PostService } from '@/services/post';

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      const { title, description, tagId } = req.body;

      try {
        const session = await auth.api.getSession({
          headers: req.headers,
        });

        if (!session) {
          return res.status(401).json({
            success: false,
            message: 'Please login first',
          });
        }

        const userId = session.user.id;
        const postData = await PostService.createPost({
          userId,
          title,
          description,
          tagId,
        });
        res.status(201).json({
          success: true,
          message: 'Post is created successfully',
          data: postData,
        });
      } catch (error) {
        console.error('POSTpost: error:', error);

        if (error instanceof InputValidationError) {
          return res
            .status(400)
            .json({ success: false, message: error.message });
        }
      }
      break;

    case 'GET':
      try {
        const postData = await PostService.getPosts();
        res.status(200).json({
          success: true,
          message: 'Post is fetched successfully',
          data: postData,
        });
      } catch (error) {
        console.error('GETpost: error', error);
        res
          .status(500)
          .json({ success: false, message: 'Internal server error' });
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
