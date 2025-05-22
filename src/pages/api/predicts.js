import formidable from 'formidable';
import { PredictService } from '@/services/predict';

export const config = {
  api: {
    bodyParser: false, // Nonaktifkan bodyParser bawaan Next.js
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const form = formidable();
      const formData = new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
          if (err) {
            reject('error');
          }
          resolve({ fields, files });
        });
      });

      const { fields, files } = await formData;

      const file = files.image;
      console.log(file)

      const predictService = new PredictService();
      const result = await predictService.predictImage(file);
      console.log(result);

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Prediction failed' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
