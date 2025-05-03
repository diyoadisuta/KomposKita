import { auth } from '@/lib/auth';

export default async function handler(req, res) {
  const session = await auth.api.getSession({
    headers: await req.headers,
  });

  console.log(session);
  return res.status(200).json({ message: 'ok' });
}
