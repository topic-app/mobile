import React from 'react';
import { Linking, Platform, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import WebView from 'react-native-webview';

import { Config } from '@constants';
import Store from '@redux/store';
import { useTheme } from '@utils/index';

import Modal from './Modal';

type Props = {
  visible: boolean;
  setVisible: (val: boolean) => void;
};

const FeedbackCard: React.FC<Props> = ({ visible, setVisible }) => {
  const uri =
    Platform.OS === 'web'
      ? `https://feedback.topicapp.fr/index.php/679489?lang=fr&newtest=Y&device_os_answer=os-web_ua-${DeviceInfo.getUserAgentSync()}&device-app-answer=redux-${
          Config.reduxVersion
        }&device-other-answer=loggedin-${Store.getState().account?.loggedIn ? 'yes' : 'no'}`
      : `https://feedback.topicapp.fr/index.php/679489?lang=fr&newtest=Y&device_model_answer=brand-${DeviceInfo.getBrand()}_id-${DeviceInfo.getDeviceId()}_product-${DeviceInfo.getProductSync()}&device_os_answer=os-${
          Platform.OS
        }_version-${DeviceInfo.getSystemVersion()}_api-${
          Platform.OS === 'android' ? DeviceInfo.getApiLevelSync() : 'unk'
        }_ua-${DeviceInfo.getUserAgentSync()}&device_app_answer=topic-${DeviceInfo.getReadableVersion()}_build-${DeviceInfo.getReadableVersion()}&device-other-answer=loggedin-${
          Store.getState().account?.loggedIn ? 'yes' : 'no'
        }`;
  const theme = useTheme();
  const { colors } = theme;

  if (visible && Platform.OS === 'web') {
    Linking.openURL(uri);
    setVisible(false);
  }

  return Platform.OS === 'web' ? null : (
    <Modal visible={visible} setVisible={setVisible}>
      <View style={{ height: 500, backgroundColor: colors.surface }}>
        <WebView
          source={{
            uri,
          }}
          onNavigationStateChange={(navState) => {
            if (
              navState.url.includes('go.topicapp.fr') ||
              navState.url.includes('www.topicapp.fr')
            ) {
              setVisible(false);
            }
          }}
        />
      </View>
    </Modal>
  );
};

export default FeedbackCard;
