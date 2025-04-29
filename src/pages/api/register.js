import { Users } from '@/services/users';
import { registerSchema } from '@/validations/schemas/user-schema';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, firstName, lastName, password } = req.body;

    try {
      const { error, value } = registerSchema.validate({
        email,
        firstName,
        lastName,
        password,
      });

      if (error) {
        res
          .status(400)
          .json({ success: false, message: error.details[0].message });
      }


      await Users.createAccount(value);

      res.status(201).json({ success: true, message: 'Account created' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  } else {
    res
      .status(400)
      .json({ messge: `This url cannot be accessed by ${req.method} method` });
  }
}
