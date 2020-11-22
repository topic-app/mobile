// import crypto from 'react-native-simple-crypto';
// import { Config } from '@constants/index';

const hashPassword = async (password: string) => {
  // For web, we dont hash the password on the client side first, it's hashed twice server-side
  /* let hashedPassword = await crypto.PBKDF2.hash(
    crypto.utils.convertUtf8ToArrayBuffer(password),
    crypto.utils.convertUtf8ToArrayBuffer(config.auth.salt),
    config.auth.iterations,
    config.auth.keylen,
    config.auth.digest,
  );
  return crypto.utils.convertArrayBufferToBase64(hashedPassword); */
  return password;
};

export { hashPassword };
