const analytics = null;
const crashlytics = null;
const messaging = null;

const getApiDevice = async () => {
  return {
    type: 'web',
    deviceId: null,
    canNotify: false,
  };
};

export { messaging, crashlytics, getApiDevice };
