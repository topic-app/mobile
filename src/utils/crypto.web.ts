// import crypto from 'react-native-simple-crypto';
import { config } from '@root/app.json';

const hashPassword = async (password: string) => {
  // For web, we dont hash the password on the client side first, it's hashed twice server-side
  return password;
};

export { hashPassword };
