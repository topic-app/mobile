import randomColor from 'randomcolor';
import React from 'react';
import { View, Platform, FlatList, TouchableOpacity } from 'react-native';
import { Divider, Button, TextInput, Title, ProgressBar } from 'react-native-paper';
import { connect } from 'react-redux';
import shortid from 'shortid';

import { Illustration, PlatformTouchable, ErrorMessage, Modal } from '@components/index';
import { tagAdd } from '@redux/actions/apiActions/tags';
import getStyles from '@styles/Styles';
import { ModalProps, State, TagPreload, TagRequestState } from '@ts/types';
import { useTheme } from '@utils/index';

import getArticleStyles from './styles/Styles';

type TagAddModalProps = ModalProps & {
  state: TagRequestState;
  name: string;
  add: (tag: TagPreload) => any;
};

function TagAddModal({ visible, setVisible, state, name, add }: TagAddModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  const [descriptionText, setDescriptionText] = React.useState('');
  const [errorVisible, setErrorVisible] = React.useState(false);

  let initialColor = randomColor();

  const [color, setColor] = React.useState(initialColor);

  const generateColors = () => {
    return ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'].map((i) =>
      randomColor({ hue: i }),
    );
  };

  const [colorList, setColorList] = React.useState([initialColor, ...generateColors()]);

  const submit = () => {
    tagAdd({
      name,
      color,
      parser: 'plaintext',
      data: descriptionText,
    }).then(({ _id }) => {
      add({ _id, name, color, displayName: name });
      setDescriptionText('');
      initialColor = randomColor();
      setColor(initialColor);
      setVisible(false);
    });
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        {state.add?.loading && <ProgressBar indeterminate />}
        {state.add?.error && (
          <ErrorMessage
            type="axios"
            strings={{
              what: "l'ajout du tag",
              contentSingular: 'Le tag',
            }}
            error={state.add?.error}
            retry={submit}
          />
        )}
        <View>
          <View style={[styles.contentContainer, { height: 200, marginBottom: 30 }]}>
            <View style={styles.centerIllustrationContainer}>
              <Illustration name="tag" height={200} width={200} />
              <Title>Créer un tag</Title>
            </View>
          </View>
          <Divider />
        </View>
        <Divider />
        <View style={articleStyles.activeCommentContainer}>
          <TextInput mode="outlined" label="Nom" value={name} disabled />
        </View>

        <View style={articleStyles.activeCommentContainer}>
          <TextInput
            autoFocus
            mode="outlined"
            label="Description (facultatif)"
            multiline
            numberOfLines={3}
            value={descriptionText}
            onChangeText={(text) => {
              setErrorVisible(false);
              setDescriptionText(text);
            }}
          />
        </View>
        <View style={[articleStyles.activeCommentContainer, { marginVertical: 20 }]}>
          <FlatList
            horizontal
            onEndReached={() => setColorList([...colorList, ...generateColors()])}
            data={colorList}
            keyExtractor={(i) => shortid()}
            renderItem={({ item, index }: { item: string; index: number }) => (
              <View>
                <TouchableOpacity onPress={() => setColor(item)}>
                  <View
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 20,
                      backgroundColor: item,
                      borderWidth: color === item ? 3 : 0,
                      borderColor: colors.primary,
                      marginLeft: index === 0 ? 20 : 10,
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
        <Divider />
        <View style={styles.contentContainer}>
          <Button
            mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
            color={colors.primary}
            uppercase={Platform.OS !== 'ios'}
            onPress={submit}
          >
            Créer le tag
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
