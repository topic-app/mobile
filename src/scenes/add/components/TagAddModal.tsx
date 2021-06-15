import randomColor from 'randomcolor';
import React from 'react';
import { View, Platform, FlatList, TouchableOpacity } from 'react-native';
import {
  Divider,
  Button,
  TextInput,
  Title,
  ProgressBar,
  useTheme,
  HelperText,
} from 'react-native-paper';
import { connect } from 'react-redux';
import shortid from 'shortid';

import { Illustration, ErrorMessage, Modal } from '@components';
import { tagAdd } from '@redux/actions/apiActions/tags';
import { ModalProps, State, TagPreload, TagRequestState } from '@ts/types';
import { trackEvent } from '@utils';

import getStyles from './styles';

type TagAddModalProps = ModalProps & {
  state: TagRequestState;
  add: (tag: TagPreload) => any;
};

function TagAddModal({ visible, setVisible, state, add }: TagAddModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const [nameText, setNameText] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  let initialColor = randomColor();

  const [color, setColor] = React.useState(initialColor);

  const generateColors = () => {
    return ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'].map((i) =>
      randomColor({ hue: i }),
    );
  };

  const [colorList, setColorList] = React.useState([initialColor, ...generateColors()]);

  const submit = () => {
    if (nameText.length > 20) {
      setError('Le nom doit faire moins de 20 lettres');
      return;
    }
    trackEvent('articleadd:tags-create');
    tagAdd({
      name: nameText.toLowerCase(),
      color,
      parser: 'plaintext',
      data: '',
    }).then(({ _id }) => {
      add({ _id, name: nameText, color, displayName: nameText });
      setNameText('');
      initialColor = randomColor();
      setColor(initialColor);
      setVisible(false);
    });
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
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
        <View style={{ flex: 1 }}>
          <View style={styles.centerIllustrationContainer}>
            <Illustration name="tag" height={200} width={200} />
            <Title>Créer un tag</Title>
          </View>
          <Divider />
        </View>
        <Divider />
        <View style={styles.activeCommentContainer}>
          <TextInput
            mode="outlined"
            label="Nom"
            value={nameText}
            error={!!error}
            autoCapitalize="none"
            onChangeText={(text) => {
              setError(null);
              setNameText(text);
            }}
          />
          <HelperText type="error" visible={!!error}>
            {error}
          </HelperText>
        </View>

        <View style={{ marginBottom: 20 }}>
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
        <View style={styles.container}>
          <Button
            mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
            color={colors.primary}
            uppercase={Platform.OS !== 'ios'}
            onPress={submit}
            loading={state.add?.loading}
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
