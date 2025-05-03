import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from './prisma';
import bcrypt from 'bcryptjs';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
  },
  user: {
    modelName: 'user',
    fields: {
      name: 'fullName',
    },
    changeEmail: {
      enabled: true,
    },
  },
  password: {
    hash: async (password) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    },
    verify: async ({ hash, password }) => {
      return await bcrypt.compare(password, hash);
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  plugins: [
    admin({
      adminRoles: ['admin'],
      adminUserIds: ['u3IShMhOF3tFVD1ycZLXsKWa0LDS4VV'],
    }),
  ],
});
