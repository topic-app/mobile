import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';

import mockAsyncStorage from './async-storage';

jest.mock('react-native-device-info', () => mockRNDeviceInfo);
jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);
