import React from 'react';
import { Platform } from 'react-native';
import ModalComponent from 'react-native-modal';
import { Card } from 'react-native-paper';

import getStyles from '@styles/Styles';
import { ModalProps } from '@ts/types';
import { useTheme } from '@utils/index';

const Modal: React.FC<ModalProps> = ({ visible, setVisible, children }) => {
  const styles = getStyles(useTheme());

  if (!visible && Platform.OS === 'ios') return null; // HACK: This is to fix a bug on iOS with multiple modals open

  return (
    <ModalComponent
      isVisible={visible}
      onBackButtonPress={() => setVisible(false)}
      onBackdropPress={() => setVisible(false)}
      useNativeDriver
      avoidKeyboard
      style={styles.bottomModal}
    >
      <Card style={styles.modalCard}>{children}</Card>
    </ModalComponent>
  );
};

export default Modal;
