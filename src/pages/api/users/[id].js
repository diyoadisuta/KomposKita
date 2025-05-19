import { auth } from '@/lib/auth';
import { NotFoundError } from '@/lib/errors';
import { UserService } from '@/services/user';

export default async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const session = await auth.api.getSession({
          headers: await req.headers,
        });

        if (!session) {
          return res.status(401).json({
            success: false,
            message: 'Please login first',
          });
        }

        if (session.user.role !== 'user') {
          return res.status(403).json({
            status: false,
            message: 'You dont have an access',
          });
        }

        const userData = await UserService.getUserById(id);
        res.status(200).json({
          success: true,
          message: 'User data is fetched successfully',
          data: userData,
        });
      } catch (error) {
        console.error('GETuserById: error', error);

        if (error instanceof NotFoundError) {
          res.status(404).json({
            success: false,
            message: error.message,
          });
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
