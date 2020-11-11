// import crypto from 'react-native-simple-crypto';
// import { Config } from '@constants/index';

const hashPassword = async (password: string) => {
  // For web, we dont hash the password on the client side first, it's hashed twice server-side
  return password;
};

// eslint-disable-next-line import/prefer-default-export
export { hashPassword };
