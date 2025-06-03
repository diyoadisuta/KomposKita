import { auth } from '@/lib/auth';
import { NotFoundError } from '@/lib/errors';
import { UserService } from '@/services/user';
import { createClient } from '@supabase/supabase-js';
import prisma from '@/lib/prisma';
import formidable from 'formidable';
import fs from 'fs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const config = {
  api: {
    bodyParser: false,
  },
};

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
        console.error('GETuser: erro:', error);

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

    case 'PUT':
      try {
        const session = await auth.api.getSession({
          headers: await req.headers,
        });

        if (!session) {
          return res
            .status(401)
            .json({ success: false, message: 'Please login first' });
        }

        const form = formidable({ multiples: true });
        const formData = new Promise((resolve, reject) => {
          form.parse(req, async (err, fields, files) => {
            if (err) {
              reject('error');
            }
            resolve({ fields, files });
          });
        });

        const { fields, files } = await formData;

        const file = files.file?.[0];
        const fileBuffer = fs.readFileSync(file.filepath);

        if (!file) {
          return res
            .status(400)
            .json({ success: false, message: 'No file uploaded' });
        }

        let fileExt;
        if (file.originalFilename) {
          const parts = file.originalFilename.split('.');
          if (parts.length > 1) {
            fileExt = parts.pop().toLowerCase();
          }
        }

        const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
        if (!allowedExtensions.includes(fileExt)) {
          return res.status(400).json({
            success: false,
            message: 'Only JPG, PNG, and WebP are allowed.',
          });
        }

        const fileName = `profile-${session.user.id}-${Date.now()}.${fileExt}`;

        const { data: image, error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(fileName, fileBuffer, {
            contentType: file.mimetype,
            upsert: true,
          });

        if (uploadError) {
          console.error('PUTuserProfile: error:', uploadError);
          return res
            .status(500)
            .json({ success: false, message: 'Something went wrong' });
        }

        const {
          data: { publicUrl: imageUrl },
        } = supabase.storage.from('profile-images').getPublicUrl(fileName);

        await prisma.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            image: imageUrl,
          },
        });

        fs.unlinkSync(file.filepath);

        res.status(200).json({
          success: true,
          message: 'User profile is updated successfully',
        });
      } catch (error) {
        console.error('PUTuser: error:', error);

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
