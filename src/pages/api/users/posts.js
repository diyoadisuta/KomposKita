import { auth } from '@/lib/auth';
import { PostService } from '@/services/post';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const session = await auth.api.getSession({
          headers: await req.headers,
        });

        if (!session) {
          return res
            .status(401)
            .json({ success: false, message: 'Please login first' });
        }

        const userPostsData = await PostService.getUserPosts(session.user.id);
        res.status(200).json({
          success: true,
          message: 'User posts is fetched successfully',
          data: userPostsData,
        });
      } catch (error) {
        console.error('GETusersposts: error:', error);

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
