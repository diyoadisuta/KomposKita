import { auth } from '@/lib/auth';
import { InputValidationError, PrismaCustomError } from '@/lib/errors';
import { MaterialService } from '@/services/material';

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      const { name, carbon, nitrogen } = req.body;

      try {
        const session = await auth.api.getSession({
          headers: await req.headers,
        });

        if (!session) {
          return res
            .status(401)
            .json({ success: false, message: 'Please login first' });
        }

        if (session.user.role !== 'admin') {
          return res
            .status(403)
            .json({ success: false, message: 'You dont have an access' });
        }

        const materialData = await MaterialService.createMaterial({
          name,
          carbon,
          nitrogen,
        });
        res.status(201).json({
          success: true,
          message: 'Material is created successfully',
          data: materialData,
        });
      } catch (error) {
        console.error('postMaterial: error:', error);

        if (error instanceof PrismaCustomError) {
          res.status(400).json({ success: false, message: error.message });
          return;
        }

        if (error instanceof InputValidationError) {
          res.status(400).json({ success: false, message: error.message });
          return;
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
