import { auth } from '@/lib/auth';
import {
  InputValidationError,
  NotFoundError,
  PrismaCustomError,
} from '@/lib/errors';
import { MaterialService } from '@/services/material';

export default async function handler(req, res) {
  const { id } = req.query;

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

        if (session.user.role !== 'admin') {
          return res
            .status(403)
            .json({ success: false, message: 'You dont have an access' });
        }

        const materialData = await MaterialService.getMaterialById(id);
        res.status(200).json({
          success: true,
          message: 'Material data is fetched successfully',
          data: materialData,
        });
      } catch (error) {
        console.error('GETmaterialById: error:', error);

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
      const { name, carbon, nitrogen } = req.body;

      try {
        const session = await auth.api.getSession({
          headers: await req.headers,
        });

        if (!session) {
          return res
            .status(401)
            .json({ status: false, message: 'Please login first' });
        }

        if (session.user.role !== 'admin') {
          return res.status(403).json({
            status: false,
            message: 'You dont have an access',
          });
        }

        await MaterialService.updateMaterial({
          id,
          name,
          carbon,
          nitrogen,
        });
        res.status(200).json({
          success: true,
          message: 'Material is successfully updated',
        });
      } catch (error) {
        console.error('PUTmaterial: error:', error);

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
            .json({ status: false, message: 'Please login first' });
        }

        if (session.user.role !== 'admin') {
          return res.status(403).json({
            status: false,
            message: 'You dont have an access',
          });
        }

        await MaterialService.deleteMaterial(id);
        res
          .status(200)
          .json({ status: true, message: 'Material is deleted successfully' });
      } catch (error) {
        console.error('DELETEmaterial: error:', error);

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
