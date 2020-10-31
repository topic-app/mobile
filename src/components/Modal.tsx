import React from 'react';
import { Card } from 'react-native-paper';
import ModalComponent from 'react-native-modal';

import { ModalProps } from '@ts/types';
import { useTheme } from '@utils/index';
import getStyles from '@styles/Styles';

const Modal = ({
  visible,
  setVisible,
  children,
}: ModalProps & { children: React.ReactElement }) => {
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
