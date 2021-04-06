// @ts-nocheck
import crypto from 'crypto-browserify';

import { Config } from '@constants';

const hashPassword = (password: string) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      Buffer.from(password),
      Buffer.from(Config.auth.salt),
      Config.auth.iterations,
      Config.auth.keylen,
      Config.auth.digest,
      (err, derivedKey) => {
        if (err) return reject();
        resolve(derivedKey.toString('base64'));
      },
    );
  });
};

export { hashPassword };
