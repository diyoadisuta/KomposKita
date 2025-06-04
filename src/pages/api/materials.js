import { MaterialService } from '@/services/material';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const materialData = await MaterialService.getMaterials();
        
        res.status(200).json({
          success: true,
          message: 'Material data is fetched successfully',
          data: materialData,
        });
      } catch (error) {
        console.error('getMaterials: error', error);

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
