import { auth } from '@/lib/auth';
import { InputValidationError } from '@/lib/errors';
import { SavedCalculationService } from '@/services/saved-calculation';

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      const { details } = req.body;

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
          await SavedCalculationService.createSavedCalc({
            userId: session.user.id,
            details,
          });

        res.status(200).json({
          success: true,
          message: 'Saved calculation is created successfully',
          data: savedCalculationData,
        });
      } catch (error) {
        console.error('POSTsavedcalc: error', error);

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

        const savedCalculationsData =
          await SavedCalculationService.getSavedCalculations(session.user.id);
        res.status(200).json({
          success: true,
          message: 'Saved calculations is fetched successfully',
          data: savedCalculationsData,
        });
      } catch (error) {
        console.error('POSTsavedcalc: error', error);

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
