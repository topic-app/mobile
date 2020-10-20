import React from 'react';
import { ModalProps, State, ArticleListItem } from '@ts/types';
import {
  Divider,
  Button,
  TextInput,
  Card,
  ThemeProvider,
  Text,
  useTheme,
  Title,
  ProgressBar,
  HelperText,
} from 'react-native-paper';
import { View, Platform, Dimensions, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { logger } from '@utils/index';
import { TagRequestState, TagsState } from '@ts/types';
import randomColor from 'randomcolor';
import shortid from 'shortid';

import {
  CollapsibleView,
  Illustration,
  PlatformTouchable,
  ErrorMessage,
  Modal,
} from '@components/index';
import getStyles from '@styles/Styles';
import { tagAdd } from '@redux/actions/apiActions/tags';
import getArticleStyles from '../styles/Styles';

type TagAddModalProps = ModalProps & {
  add: (link: string, name: string) => any;
};

function TagAddModal({ visible, setVisible, add }: TagAddModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
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
      add(linkText, nameText ? nameText : linkText);
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
            label="Lien"
            value={linkText}
            onChangeText={(text) => {
              setErrorVisible(false);
              setLinkText(text);
            }}
          />
        </View>
        <View style={articleStyles.activeCommentContainer}>
          <TextInput
            mode="outlined"
            label="Texte (facultatif)"
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
}

const mapStateToProps = (state: State) => {
  const { tags } = state;
  return {
    state: tags.state,
  };
};

export default connect(mapStateToProps)(TagAddModal);
