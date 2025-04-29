import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export class Users {
  static async createAccount({ email, firstName, lastName, password }) {
    const userData = {
      email,
      firstName,
      lastName,
      password,
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    await prisma.user.create({
      data: { ...userData, password: hashedPassword },
    });
  }
}
