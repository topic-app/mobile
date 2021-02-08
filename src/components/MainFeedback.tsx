import React from 'react';
import { Linking, Platform, View, ActivityIndicator } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import WebView from 'react-native-webview';

import { Config } from '@constants';
import Store from '@redux/store';
import { trackEvent, useTheme } from '@utils/index';

import Modal from './Modal';

type Props = {
  visible: boolean;
  setVisible: (val: boolean) => void;
};

const FeedbackCard: React.FC<Props> = ({ visible, setVisible }) => {
  const { loggedIn } = Store.getState().account;
  const { OS } = Platform;
  const userAgent = DeviceInfo.getUserAgentSync();

  let uri = 'https://feedback.topicapp.fr/index.php/679489?lang=fr&newtest=Y';

  if (OS === 'web') {
    uri += `&device_os_answer=os-web_ua-${userAgent}`;
    uri += `&device-app-answer=redux-${Config.reduxVersion}`;
    uri += `&device-other-answer=loggedin-${loggedIn ? 'yes' : 'no'}`;
  } else {
    const brand = DeviceInfo.getBrand();
    const deviceId = DeviceInfo.getDeviceId();
    const product = DeviceInfo.getProductSync();
    const systemVersion = DeviceInfo.getSystemVersion();
    const topicVersion = DeviceInfo.getReadableVersion();
    const apiLevel = OS === 'android' ? DeviceInfo.getApiLevelSync() : 'unk';

    uri += `&device_model_answer=brand-${brand}_id-${deviceId}_product-${product}`;
    uri += `&device_os_answer=os-${OS}_version-${systemVersion}_api-${apiLevel}_ua-${userAgent}`;
    uri += `&device_app_answer=topic-${topicVersion}_build-${topicVersion}`;
    uri += `&device-other-answer=loggedin-${loggedIn ? 'yes' : 'no'}`;
  }

  const theme = useTheme();
  const { colors } = theme;

  const [open, setOpen] = React.useState(false);

  if (visible && Platform.OS === 'web' && !open) {
    trackEvent('feedback:main-open');
    Linking.openURL(uri);
    setVisible(false);
    setOpen(true);
  }

  return Platform.OS === 'web' ? null : (
    <Modal visible={visible} setVisible={setVisible}>
      <View style={{ height: 500, backgroundColor: colors.surface }}>
        <WebView
          source={{ uri }}
          startInLoadingState
          renderLoading={() => (
            <View
              style={{
                flex: 1,
                position: 'absolute',
                height: '100%',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
          onNavigationStateChange={(navState) => {
            if (
              navState.url.includes('go.topicapp.fr') ||
              navState.url.includes('www.topicapp.fr')
            ) {
              trackEvent('feedback:main-close');
              setVisible(false);
            }
          }}
        />
      </View>
    </Modal>
  );
};

export default FeedbackCard;
