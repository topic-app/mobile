import React from 'react';
import { View, Platform } from 'react-native';
import { Divider, Button, TextInput, HelperText, useTheme } from 'react-native-paper';

import { FileUpload, Modal } from '@components';
import { ModalProps } from '@ts/types';
import { trackEvent } from '@utils';

import getStyles from './styles';

type ImageUploadModalProps = ModalProps & {
  insertImage: (file: string) => void;
  group: string;
};

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  visible,
  setVisible,
  insertImage,
  group,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View style={{ margin: 30 }}>
        <FileUpload
          file={null}
          setFile={(file) => {
            if (file) {
              insertImage(file);
            }
            setVisible(false);
          }}
          group={group || ''}
        />
      </View>
    </Modal>
  );
};

export default ImageUploadModal;
