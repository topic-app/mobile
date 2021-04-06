import React from 'react';
import { Platform, ScrollView, View } from 'react-native';
import ModalComponent from 'react-native-modal';
import { Card, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import getStyles from '@styles/global';
import { ModalProps } from '@ts/types';

const Modal: React.FC<ModalProps> = ({ visible, setVisible, children }) => {
  const styles = getStyles(useTheme());

  const insets = useSafeAreaInsets();

  if (!visible && Platform.OS === 'ios') return null; // HACK: This is to fix a bug on iOS with multiple modals open

  return (
    <ModalComponent
      isVisible={visible}
      onBackButtonPress={() => setVisible(false)}
      onBackdropPress={() => setVisible(false)}
      onSwipeComplete={() => setVisible(false)}
      useNativeDriver
      avoidKeyboard
      style={styles.bottomModal}
    >
      <Card style={styles.modalCard}>
        <ScrollView keyboardShouldPersistTaps="handled" bounces={false}>
          <View style={{ marginBottom: insets.bottom }}>{children}</View>
        </ScrollView>
      </Card>
    </ModalComponent>
  );
};

export default Modal;
