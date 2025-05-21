import { createAuthClient } from 'better-auth/react'; // make sure to import from better-auth/react
import { adminClient } from 'better-auth';

// TODO: YOU SHOULD DEFINE AND CONFIG ADMINCLIENT()!!!
export const authClient = createAuthClient({
  fetchOptions: {
    credentials: 'include',
  },
});
