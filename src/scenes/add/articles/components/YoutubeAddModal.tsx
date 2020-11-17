import React from 'react';
import { Divider, Button, TextInput, HelperText } from 'react-native-paper';
import { View, Platform } from 'react-native';
import { connect } from 'react-redux';

import { ModalProps, State } from '@ts/types';
import { Modal } from '@components/index';
import { useTheme } from '@utils/index';
import getStyles from '@styles/Styles';

import getArticleStyles from '../styles/Styles';
import config from '@constants/config';

type YoutubeAddModalProps = ModalProps & {
  add: (url: string) => any;
};

const YoutubeAddModal: React.FC<YoutubeAddModalProps> = ({ visible, setVisible, add }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  const [linkText, setLinkText] = React.useState('');
  const [nameText, setNameText] = React.useState('');
  const [errorVisible, setErrorVisible] = React.useState(false);

  const submit = () => {
    if (true) {
      let id = linkText
        .replace('https://', '')
        .replace('http://', '')
        .replace(
          /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi,
          '$1',
        );
      console.log(id);
      add(`${config.google.youtubePlaceholder}${id}`);
      setNameText('');
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
