import React from 'react';
import ModalComponent from 'react-native-modal';
import { Card } from 'react-native-paper';

import getStyles from '@styles/Styles';
import { ModalProps } from '@ts/types';
import { useTheme } from '@utils/index';

const Modal: React.FC<ModalProps> = ({ visible, setVisible, children }) => {
  const styles = getStyles(useTheme());
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
