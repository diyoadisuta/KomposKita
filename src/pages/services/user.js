// import { authClient } from '@/lib/auth-client';
import { NotFoundError, AuthenticationError } from '@/lib/errors';
import prisma from '@/lib/prisma';

/* INFO: AUTH HANDLED BY BETTER-AUTH
    SIGNUP : '{BASE_URL}/auth/sign-up/email'
    SINGIN: '{BASE_URL}/auth/sign-in/email'
*/

// TODO: VALIDATION LIB?
// TODO: TELL FE ABOUT THIS CODE BELOW

// export const signup = await authClient.signUp.email(
//   {
//     email,
//     name,
//     password,
//   },
//   {
//     onError: (ctx) => {
//       console.error(ctx.error);
//     },
//   }
// );

// export const signin = await authClient.signIn.email(
//   {
//     email,
//     password,
//   },
//   {
//     onError: (ctx) => {
//       console.error(ctx.error.message);
//     },
//   }
// );

// export const updateUser = await authClient.updateUser(
//   {
//     name,
//     image,
//   },
//   {
//     onError: (ctx) => {
//       console.error(ctx.error.message);
//     },
//   }
// );

// START FROM HERE
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
      }
    });

    if (!userData) {
      throw new NotFoundError('Account is not found');
    }

    return userData;
  }
}
