import React from 'react';
import { View, Platform } from 'react-native';
import { Divider, Button, TextInput, HelperText } from 'react-native-paper';
import { connect } from 'react-redux';

import { Modal } from '@components/index';
import config from '@constants/config';
import getStyles from '@styles/Styles';
import { ModalProps, State } from '@ts/types';
import { useTheme } from '@utils/index';

import getArticleStyles from './styles/Styles';

type YoutubeAddModalProps = ModalProps & {
  add: (url: string) => any;
};

const YoutubeAddModal: React.FC<YoutubeAddModalProps> = ({ visible, setVisible, add }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  const [linkText, setLinkText] = React.useState('');
  const [errorVisible, setErrorVisible] = React.useState(false);

  const submit = () => {
    if (
      linkText.match(
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/gi,
      )
    ) {
      const id = linkText
        .replace('https://', '')
        .replace('http://', '')
        .replace('www.', '')
        .replace(/&t=[0-9]*/g, '')
        .replace(
          /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/gi,
          '$1',
        );
      add(`${config.google.youtubePlaceholder}${id}`);
      setVisible(false);
      setLinkText('');
    } else {
      setErrorVisible(true);
    }
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        <View style={articleStyles.activeCommentContainer}>
          <TextInput
            autoFocus
            mode="outlined"
            label="Lien YouTube"
            value={linkText}
            onChangeText={(text) => {
              setErrorVisible(false);
              setLinkText(text);
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
            Insérer la vidéo
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const mapStateToProps = (state: State) => {
  const { tags } = state;
  return {
    state: tags.state,
  };
};

export default connect(mapStateToProps)(YoutubeAddModal);
