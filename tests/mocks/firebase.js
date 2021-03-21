/* eslint-disable no-undef */
export default {
  messaging: jest.fn(() => ({
    hasPermission: jest.fn(() => Promise.resolve(true)),
    subscribeToTopic: jest.fn(),
    unsubscribeFromTopic: jest.fn(),
    requestPermission: jest.fn(() => Promise.resolve(true)),
    getToken: jest.fn(() => Promise.resolve('myMockToken')),
  })),
  notifications: jest.fn(() => ({
    onNotification: jest.fn(),
    onNotificationDisplayed: jest.fn(),
  })),
  crashlytics: jest.fn(() => ({
    logError: jest.fn(),
  })),
  getApiDevice: jest.fn(() => ({
    type: 'web',
    deviceId: null,
    canNotify: false,
  })),
};
