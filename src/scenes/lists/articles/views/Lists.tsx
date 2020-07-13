import React from 'react';
import PropTypes from 'prop-types';
import {
  ProgressBar,
  Divider,
  Text,
  List,
  Button,
  HelperText,
  Card,
  useTheme,
} from 'react-native-paper';
import { View, Platform, FlatList, Alert, TextInput } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';

import { State } from '@ts/types';
import {
  ErrorMessage,
  PlatformTouchable,
  PlatformIconButton,
  CollapsibleView,
  Illustration,
} from '@components/index';
import getStyles from '@styles/Styles';
import { deleteArticleList, addArticleList } from '@redux/actions/lists/articles';
import getArticleStyles from '../styles/Styles';

function ArticleLists({ articles, preferences, account, state }) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  const [createListText, setCreateListText] = React.useState('');
  const [isCreateModalVisible, setCreateModalVisible] = React.useState(false);
  const [errorVisible, setErrorVisible] = React.useState(false);

  return (
    <View style={styles.page}>
      {state.info.loading && <ProgressBar indeterminate />}
      {state.info.error && <ErrorMessage type="axios" error={state.info.error} retry={fetch} />}
      <FlatList
        data={articles.lists}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.centerIllustrationContainer}>
              <Illustration name="article-lists" height={200} width={200} />
              <View style={styles.contentContainer}>
                <Text>Ajoutez vos articles à des listes afin de les retrouver facilement.</Text>
                <Text>
                  Les articles ajoutés seront disponibles hors-ligne
                  {account.loggedIn && preferences.syncLists
                    ? ' et seront sauvegardés sur votre compte.'
                    : '.'}
                </Text>
              </View>
            </View>
            <Divider />
          </View>
        )}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => {
          return (
            <List.Item
              title={item.name}
              left={() => <List.Icon icon={item.icon} />}
              right={() => (
                <PlatformTouchable
                  onPress={() => {
                    Alert.alert(
                      `Voulez vous vraiment supprimer la liste ${item.name}?`,
                      'Cette action est irréversible',
                      [
                        {
                          text: 'Annuler',
                          onPress: () => {},
                        },
                        {
                          text: 'Supprimer',
                          onPress: () => deleteArticleList(item.id),
                        },
                      ],
                      {
                        cancelable: true,
                      },
                    );
                  }}
                >
                  <List.Icon icon="delete" />
                </PlatformTouchable>
              )}
            />
          );
        }}
        ListFooterComponent={() => (
          <View>
            <Divider />
            <View style={styles.container}>
              <Button
                mode={Platform.OS === 'ios' ? 'text' : 'outlined'}
                uppercase={Platform.OS !== 'ios'}
                onPress={() => setCreateModalVisible(true)}
              >
                Créer
              </Button>
            </View>
          </View>
        )}
      />
      <Modal
        isVisible={isCreateModalVisible}
        avoidKeyboard
        onBackdropPress={() => setCreateModalVisible(false)}
        onBackButtonPress={() => setCreateModalVisible(false)}
        onSwipeComplete={() => setCreateModalVisible(false)}
        swipeDirection={['down']}
        style={styles.bottomModal}
      >
        <Card>
          <View>
            <Divider />

            <View style={articleStyles.activeCommentContainer}>
              <TextInput
                autoFocus
                placeholder="Nom de la liste"
                placeholderTextColor={colors.disabled}
                style={articleStyles.addListInput}
                value={createListText}
                onChangeText={(text) => {
                  setErrorVisible(false);
                  setCreateListText(text);
                }}
              />
              <CollapsibleView collapsed={!errorVisible}>
                <HelperText type="error" visible={errorVisible}>
                  Vous devez entrer un nom
                </HelperText>
              </CollapsibleView>
            </View>
            <CollapsibleView collapsed={!articles.lists.some((l) => l.name === createListText)}>
              <HelperText
                type="error"
                visible={articles.lists.some((l) => l.name === createListText)}
              >
                Une liste avec ce nom existe déjà
              </HelperText>
            </CollapsibleView>
            <Divider />
            <View style={styles.contentContainer}>
              <Button
                mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
                color={colors.primary}
                uppercase={Platform.OS !== 'ios'}
                onPress={() => {
                  if (createListText === '') {
                    setErrorVisible(true);
                  } else if (!articles.lists.some((l) => l.name === createListText)) {
                    // TODO: Add icon picker, or just remove the icon parameter and use a material design list icon
                    addArticleList(createListText);
                    setCreateListText('');
                    setCreateModalVisible(false);
                  }
                }}
              >
                Créer la liste
              </Button>
            </View>
          </View>
        </Card>
      </Modal>
    </View>
  );
}

const mapStateToProps = (state: State) => {
  const { articles, preferences, account } = state;
  return {
    articles,
    preferences,
    account,
    state: articles.state,
  };
};

export default connect(mapStateToProps)(ArticleLists);

ArticleLists.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  params: PropTypes.shape().isRequired,
  state: PropTypes.shape({
    info: PropTypes.shape({}).isRequired,
  }).isRequired,
};
