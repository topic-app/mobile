const analytics = null;
const crashlytics = null;

const getApiDevice = async () => {
  return {
    type: 'web',
    deviceId: null,
    canNotify: false,
  };
};

export { analytics, crashlytics, getApiDevice };
