import { NotFoundError } from '@/lib/errors';
import prisma from '@/lib/prisma';
export class UserService {
  static async getUserById(userId) {
    const userData = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        image: true,
        isSubscribed: true,
      },
    });

    if (!userData) {
      throw new NotFoundError('Account is not found');
    }

    return userData;
  }
}
