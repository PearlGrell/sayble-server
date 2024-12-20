import crypto from 'crypto';

type verifyPasswordArgs = {
      user: any,
      password: string
}

export const verifyPassword = async ({ user, password }: verifyPasswordArgs) => {
      const hash = crypto.pbkdf2Sync(password, user?.salt, 1000, 64, 'sha512').toString('hex');
      return hash === user?.password;
}