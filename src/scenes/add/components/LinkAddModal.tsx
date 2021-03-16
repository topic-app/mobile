import React from 'react';
import { View, Platform } from 'react-native';
import { Divider, Button, TextInput, HelperText, useTheme } from 'react-native-paper';

import { Modal } from '@components';
import { ModalProps } from '@ts/types';
import { trackEvent } from '@utils';

import getStyles from './styles';

type LinkAddModalProps = ModalProps & {
  add: (link: string, name: string) => any;
};

const LinkAddModal: React.FC<LinkAddModalProps> = ({ visible, setVisible, add }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const [linkText, setLinkText] = React.useState('');
  const [nameText, setNameText] = React.useState('');
  const [errorVisible, setErrorVisible] = React.useState(false);

  const submit = () => {
    if (
      linkText.match(
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
      )
    ) {
      trackEvent('articleadd:content-link-insert');
      add(linkText, nameText || linkText);
      setNameText('');
      setLinkText('');
    } else {
      setErrorVisible(true);
    }
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        <View style={styles.activeCommentContainer}>
          <TextInput
            autoFocus
            mode="outlined"
            label="Lien"
            autoCapitalize="none"
            keyboardType="url"
            textContentType="URL"
            value={linkText}
            onChangeText={(text) => {
              setErrorVisible(false);
              setLinkText(text);
            }}
          />
        </View>
        <View style={styles.activeCommentContainer}>
          <TextInput
            mode="outlined"
            label="Texte (facultatif)"
            autoCapitalize="none"
            value={nameText}
            onChangeText={(text) => {
              setErrorVisible(false);
              setNameText(text);
            }}
          />
        </View>
        <HelperText visible={errorVisible} type="error">
          Veuillez insérer un lien valide
        </HelperText>
        <Divider />
        <View style={styles.contentContainer}>
          <Button
            mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
            color={colors.primary}
            uppercase={Platform.OS !== 'ios'}
            onPress={submit}
          >
            Insérer le lien
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default LinkAddModal;
