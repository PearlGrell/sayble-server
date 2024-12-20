import crypto from 'crypto';

type HashGenerateType = (text: string) => { salt: string, hash: string };

export const generate_hash : HashGenerateType = (text)=> {
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.pbkdf2Sync(text, salt, 1000, 64, 'sha512').toString('hex');
      return { salt, hash };
}