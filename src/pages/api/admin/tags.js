import { auth } from '@/lib/auth';
import {
  InputValidationError,
  NotFoundError,
  PrismaCustomError,
} from '@/lib/errors';
import { TagService } from '@/services/tag';

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      const { name } = req.body;

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

        if (session.user.role !== 'admin') {
          return res.status(403).json({
            success: false,
            message: 'You dont have an access',
          });
        }

        const tagData = await TagService.createTag({ name });
        res.status(201).json({
          success: true,
          message: 'Tag is created successfully created',
          data: tagData,
        });
      } catch (error) {
        console.error('POSTtag: error:', error);

        if (error instanceof InputValidationError) {
          return res
            .status(400)
            .json({ success: false, message: error.message });
        }

        if (error instanceof PrismaCustomError) {
          return res
            .status(400)
            .json({ success: false, message: error.message });
        }

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
