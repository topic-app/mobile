import crypto from 'crypto-browserify';

import { Config } from '@constants/index';
import { logger } from '@utils';

const hashPassword = (password: string) => {
  return new Promise((resolve, reject) => {
    const hashedPassword = crypto.pbkdf2(
      Buffer.from(password),
      Buffer.from(Config.auth.salt),
      Config.auth.iterations,
      Config.auth.keylen,
      Config.auth.digest,
      (err, derivedKey) => resolve(derivedKey.toString('base64')),
    );
  });
};

export { hashPassword };
