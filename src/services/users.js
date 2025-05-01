import { authClient } from '@/lib/auth-client';
import { NotFoundError, AuthenticationError } from '@/lib/errors';

/* INFO: AUTH HANDLED BY BETTER-AUTH
    SIGNUP : '{BASE_URL}/auth/sign-up/email'
    SINGIN: '{BASE_URL}/auth/sign-in/email'
*/

// TODO: VVALIDATION LIB?
await authClient.signUp.email(
  {
    email,
    name,
    password,
  },
  {
    onError: (ctx) => {
      console.error(ctx.error);
    },
  }
);

await authClient.signIn.email(
  {
    email,
    password,
  },
  {
    onError: (ctx) => {
      console.error(ctx.error.message);
    },
  }
);
