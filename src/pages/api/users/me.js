import { auth } from '@/lib/auth';
import { NotFoundError } from '@/lib/errors';
import { UserService } from '@/services/user';

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

        const userData = await UserService.getUserById(session.user.id);

        return res.status(200).json({
          success: true,
          message: 'User data is fetched successfully',
          data: userData,
        });
      } catch (error) {
        console.error('GETuser: error', error);

        if (error instanceof NotFoundError) {
          return res
            .status(404)
            .json({ success: false, message: 'User not found' });
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
