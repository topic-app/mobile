const crashlytics = null;
const messaging = null;

const getApiDevice = () => {
  return {
    type: 'web',
    deviceId: null,
    canNotify: false,
  };
};

export { messaging, crashlytics, getApiDevice };
