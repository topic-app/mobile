import crypto from 'react-native-simple-crypto';
import { Config } from '@constants/index';

const hashPassword = async (password: string) => {
  const hashedPassword = await crypto.PBKDF2.hash(
    crypto.utils.convertUtf8ToArrayBuffer(password),
    crypto.utils.convertUtf8ToArrayBuffer(Config.auth.salt),
    Config.auth.iterations,
    Config.auth.keylen,
    Config.auth.digest,
  );
  return crypto.utils.convertArrayBufferToBase64(hashedPassword);
};

// eslint-disable-next-line import/prefer-default-export
export { hashPassword };
