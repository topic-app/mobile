import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';

import mockAsyncStorage from './async-storage';
import mockRNGeolocationService from './react-native-geolocation-service';

jest.mock('react-native-device-info', () => mockRNDeviceInfo);
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('react-native-geolocation-service', () => mockRNGeolocationService);
