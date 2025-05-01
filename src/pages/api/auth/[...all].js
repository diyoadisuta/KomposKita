import { toNodeHandler } from 'better-auth/node';
import { auth } from '@/lib/auth';

export const config = { api: { bodyParser: false } };

export default toNodeHandler(auth.handler);

// TODO: CONSIDER REWRITE BETTER-AUTH INTERNAL RESPONSE FORMAT