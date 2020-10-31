import crypto from 'react-native-simple-crypto';
import { config } from '@root/app.json';

const hashPassword = async (password: string) => {
  const hashedPassword = await crypto.PBKDF2.hash(
    crypto.utils.convertUtf8ToArrayBuffer(password),
    crypto.utils.convertUtf8ToArrayBuffer(config.auth.salt),
    config.auth.iterations,
    config.auth.keylen,
    config.auth.digest,
  );
  return crypto.utils.convertArrayBufferToBase64(hashedPassword);
};

export { hashPassword };
