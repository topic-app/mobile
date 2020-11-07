import React from 'react';
import { ModalProps } from '@ts/types';
import { View } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { default as ModalComponent } from 'react-native-modal';
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
