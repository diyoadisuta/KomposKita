import { auth } from '@/lib/auth';
import { NotFoundError } from '@/lib/errors';
import { SavedCalculationService } from '@/services/saved-calculation';

export default async function handler(req, res) {
  const { scid } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const session = await auth.api.getSession({
          headers: req.headers,
        });

        if (!session) {
          return res
            .status(401)
            .json({ success: false, message: 'Please login first' });
        }

        const savedCalculationData =
          await SavedCalculationService.getSavedCalculationById(scid);
        res.status(200).json({
          success: true,
          message: 'Saved calculation detail is fetced successfully',
          data: savedCalculationData,
        });
      } catch (error) {
        console.error('GETsavedCalcDetail: error:', error);

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

    case 'DELETE':
      try {
        const session = await auth.api.getSession({
          headers: req.headers,
        });

        if (!session) {
          return res
            .status(401)
            .json({ success: false, message: 'Please login first' });
        }

        await SavedCalculationService.deleteSavedCalculation({
          sessionUserId: session.user.id,
          scid,
        });
        res.status(200).json({
          success: true,
          message: 'Saved calculation is deleted successfully',
        });
      } catch (error) {
        console.error('DELETEsavedcalc: error:', error);

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
