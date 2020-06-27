import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  Divider,
  List,
  useTheme,
  Card,
  RadioButton,
  Button,
  IconButton,
  HelperText,
} from 'react-native-paper';
import {
  View,
  Image,
  TextInput,
  ActivityIndicator,
  Animated,
  FlatList,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import Modal from 'react-native-modal';

import { Article, State, StackNavigationProp, RouteProp } from '@ts/types';
import { config } from '@root/app.json';
import {
  ErrorMessage,
  Content,
  TagList,
  InlineCard,
  CollapsibleView,
  PlatformIconButton,
  CategoryTitle,
  CategoriesList,
  AnimatingHeader,
  Illustration,
} from '@components/index';
import { fetchArticle } from '@redux/actions/api/articles';
import { addArticleRead, addArticleToList, addArticleList } from '@redux/actions/lists/articles';
import { updateComments } from '@redux/actions/api/comments';
import { commentAdd } from '@redux/actions/apiActions/comments';
import getStyles from '@styles/Styles';
import { getImageUrl } from '@utils/index';

import CommentInlineCard from '../components/Comment';
import getArticleStyles from '../styles/Styles';
import { ArticleDisplayStackParams } from '../index';

type Navigation = StackNavigationProp<ArticleDisplayStackParams, 'Display'>;
type Route = RouteProp<ArticleDisplayStackParams, 'Display'>;

type ArticleDisplayHeaderProps = {
  article: Article;
  navigation: Navigation;
  reqState;
};

const ArticleDisplayHeader: React.FC<ArticleDisplayHeaderProps> = ({
  article,
  navigation,
  reqState,
  account,
  setCommentModalVisible,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  const { following } = account?.accountInfo?.user?.data || {};

  return (
    <View style={styles.page}>
      {article.image && (
        <Image
          source={{ uri: getImageUrl(article.image, 'large') }}
          style={[styles.image, articleStyles.image]}
        />
      )}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.subtitle}>
          Le {moment(article.date).format('LL')} à {moment(article.date).format('LT')}
        </Text>
      </View>
      <TagList type="article" item={article} />
      {reqState.articles.info.loading && <ActivityIndicator size="large" color={colors.primary} />}
      {!article.preload && reqState.articles.info.success && (
        <View>
          <View style={styles.contentContainer}>
            <Content data={article.content.data} parser={article.content.parser} />
          </View>
          <Divider />
          <View style={styles.container}>
            <CategoryTitle>Auteur</CategoryTitle>
          </View>
          <InlineCard
            icon="account-edit"
            title={article.author.displayName}
            onPress={() => console.log('navigate to user', article.author._id)}
            badge={
              account.loggedIn &&
              account.accountInfo.user &&
              following?.users.includes(article.author._id)
                ? 'account-heart'
                : null
            }
            badgeColor={colors.valid}
            // TODO: Add imageUrl: imageUrl={article.author.imageUrl}
            // also need to add subtitle with username/handle: subtitle={article.author.username or .handle}
          />
          <InlineCard
            icon="account-multiple"
            title={article.group.displayName}
            onPress={() => console.log('navigate to group', article.group._id)}
            badge={
              account.loggedIn &&
              account.accountInfo.user &&
              following?.groups.includes(article.group._id)
                ? 'account-heart'
                : null
            }
            badgeColor={colors.valid}
            // TODO: Add imageUrl: imageUrl={article.group.imageUrl}
            // also need to add subtitle with handle: subtitle={article.group.handle}
          />
          <View style={styles.container}>
            <CategoryTitle>Commentaires</CategoryTitle>
          </View>
          <Divider />
          {account.loggedIn ? (
            <View>
              <List.Item
                title="Écrire un commentaire"
                titleStyle={articleStyles.placeholder}
                right={() => <List.Icon icon="comment-plus" color={colors.icon} />}
                onPress={() => setCommentModalVisible(true)}
              />
            </View>
          ) : (
            <View style={styles.contentContainer}>
              <Text style={articleStyles.disabledText}>
                Connectez vous pour écrire un commentaire
              </Text>
              <Text>
                <Text
                  onPress={() =>
                    navigation.navigate('Auth', {
                      screen: 'Login',
                    })
                  }
                  style={[styles.link, styles.primaryText]}
                >
                  Se connecter
                </Text>
                <Text style={articleStyles.disabledText}> ou </Text>
                <Text
                  onPress={() =>
                    navigation.navigate('Auth', {
                      screen: 'Create',
                    })
                  }
                  style={[styles.link, styles.primaryText]}
                >
                  créér un compte
                </Text>
              </Text>
            </View>
          )}
          <Divider />
          <View>
            {reqState.comments.list.error && (
              <ErrorMessage
                type="axios"
                strings={{
                  what: 'la récupération des commentaires',
                  contentPlural: 'des commentaires',
                }}
                error={reqState.comments.list.error}
                retry={() => updateComments('initial', { parentId: article._id })}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
};

function ArticleDisplay({ route, navigation, articles, comments, reqState, account, lists }) {
  const { id, useLists } = route.params;
  React.useEffect(() => {
    if (!(useLists && lists?.some((l) => l.items?.some((i) => i._id === id)))) {
      fetchArticle(id);
    }
    updateComments('initial', { parentId: id });
    addArticleRead(id);
  });

  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  let article = {};
  if (useLists && lists?.some((l) => l.items?.some((i) => i._id === id))) {
    article = lists?.find((l) => l.items?.some((i) => i._id === id))?.find((i) => i._id === id);
    console.log(`Article ${article}`);
  } else {
    article = articles.find((t) => t._id === id);
  }
  const articleComments = comments.filter((c) => c.parent === article._id);

  const [isListModalVisible, setListModalVisible] = React.useState(false);
  const [list, setList] = React.useState(lists[0]?.id);
  const [createList, setCreateList] = React.useState(false);
  const [errorVisible, setErrorVisible] = React.useState(false);

  const [isCommentModalVisible, setCommentModalVisible] = React.useState(false);
  const [commentText, setCommentText] = useState('');
  const [publisher, setPublisher] = React.useState('user');
  const tooManyChars = commentText.length > config.comments.maxCharacters;

  let commentCharCountColor = colors.softContrast;
  if (tooManyChars) {
    commentCharCountColor = colors.error;
  } else if (commentText.length > 0.9 * config.comments.maxCharacters) {
    commentCharCountColor = colors.warning;
  }

  let publishers = [];
  if (account.loggedIn) {
    publishers = [
      {
        key: 'user',
        title: account.accountInfo?.user?.info?.username,
        icon: 'account',
        publisher: {
          type: 'user',
        },
        type: 'category',
      },
      ...account.groups?.map((g) => {
        return {
          key: g._id,
          title: g.shortName || g.name,
          icon: 'newspaper',
          publisher: {
            type: 'group',
            group: g._id,
          },
          type: 'category',
        };
      }),
    ];
  }

  const submitComment = () => {
    commentAdd(
      publishers.find((p) => p.key === publisher).publisher,
      { parser: 'plaintext', data: commentText },
      id,
      'article',
    )
      .then(() => {
        setCommentText('');
        updateComments('initial', { parentId: id });
        setCommentModalVisible(false);
      })
      .catch(() => console.log('Reject'));
  };

  const scrollY = new Animated.Value(0);

  if (!article) {
    // This is when article has not been loaded in list, so we have absolutely no info
    return (
      <View style={styles.page}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  return (
    <View style={styles.page}>
      <AnimatingHeader
        value={scrollY}
        title={route.params.title || 'Actus - Aperçu'}
        subtitle={route.params.title && 'Actus - Aperçu'}
        actions={[
          {
            icon: 'playlist-plus',
            onPress: () => setListModalVisible(true),
          },
        ]}
        overflow={[{ title: 'Hello', onPress: () => console.log('Hello') }]}
      >
        {reqState.articles.info.error && (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la récupération de cet article',
              contentSingular: "L'article",
            }}
            error={reqState.articles.info.error}
            retry={() => fetchArticle(id)}
          />
        )}
      </AnimatingHeader>
      <Animated.FlatList
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        ListHeaderComponent={() => (
          <ArticleDisplayHeader
            article={article}
            reqState={reqState}
            account={account}
            route={route}
            navigation={navigation}
            setCommentModalVisible={setCommentModalVisible}
          />
        )}
        data={reqState.articles.info.success ? articleComments : []}
        refreshing={reqState.comments.list.loading.refresh}
        onRefresh={() => {
          fetchArticle(id);
          updateComments('refresh', { parentId: id });
        }}
        // onEndReached={() => {
        //   console.log('comment end reached');
        //   updateComments('next', { parentId: id });
        // }}
        // onEndReachedThreshold={0.5}
        keyExtractor={(comment) => comment._id}
        ItemSeparatorComponent={Divider}
        ListFooterComponent={
          reqState.articles.info.success ? (
            <View>
              <Divider />
              <View style={[styles.container, { height: 50 }]}>
                {reqState.comments.list.loading.next ?? (
                  <ActivityIndicator size="large" color={colors.primary} />
                )}
              </View>
            </View>
          ) : null
        }
        ListEmptyComponent={() =>
          reqState.comments.list.success &&
          reqState.articles.info.success && (
            <View style={styles.contentContainer}>
              <View style={styles.centerIllustrationContainer}>
                <Illustration name="comment-empty" height={200} width={200} />
                <Text>Aucun commentaire</Text>
              </View>
            </View>
          )
        }
        renderItem={({ item }) => <CommentInlineCard comment={item} />}
      />
      <Modal
        isVisible={isListModalVisible}
        avoidKeyboard
        onBackdropPress={() => setListModalVisible(false)}
        onBackButtonPress={() => setListModalVisible(false)}
        onSwipeComplete={() => setListModalVisible(false)}
        swipeDirection={['down']}
        style={styles.bottomModal}
      >
        <Card>
          <FlatList
            data={lists}
            ListHeaderComponent={() => (
              <View>
                <View style={styles.contentContainer}>
                  <View style={styles.centerIllustrationContainer}>
                    <Illustration name="article-lists" height={200} width={200} />
                    <Text>Ajouter cet article à une liste</Text>
                  </View>
                </View>
                <Divider />
              </View>
            )}
            renderItem={({ item }) => {
              const disabled = item?.items?.some((i) => i._id === id);
              return (
                <View>
                  <List.Item
                    title={item.name}
                    onPress={() => {
                      if (!disabled) {
                        setCreateList(false);
                        setList(item.id);
                      }
                    }}
                    left={() =>
                      Platform.OS !== 'ios' && (
                        <RadioButton
                          disabled={disabled}
                          color={colors.primary}
                          status={item.id === list ? 'checked' : 'unchecked'}
                          onPress={() => {
                            if (!disabled) {
                              setCreateList(false);
                              setList(item.id);
                            }
                          }}
                        />
                      )
                    }
                    right={() =>
                      Platform.OS === 'ios' && (
                        <RadioButton
                          disabled={disabled}
                          color={colors.primary}
                          status={item.id === list ? 'checked' : 'unchecked'}
                          onPress={() => {
                            if (!disabled) {
                              setCreateList(false);
                              setList(item.id);
                            }
                          }}
                        />
                      )
                    }
                  />
                </View>
              );
            }}
            ListFooterComponent={() => {
              const [createListText, setCreateListText] = React.useState('');
              return (
                <View>
                  <List.Item
                    title="Créer une liste"
                    onPress={() => {
                      setList(null);
                      setCreateList(true);
                    }}
                    left={() =>
                      Platform.OS !== 'ios' && (
                        <IconButton
                          style={{ width: 24, height: 24 }}
                          color={colors.primary}
                          icon="plus"
                          onPress={() => {
                            setList(null);
                            setCreateList(true);
                          }}
                        />
                      )
                    }
                  />
                  <CollapsibleView collapsed={!createList}>
                    <Divider />

                    <View style={articleStyles.activeCommentContainer}>
                      <TextInput
                        autoFocus
                        placeholder="Nom de la liste"
                        placeholderTextColor={colors.disabled}
                        style={articleStyles.commentInput}
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
                    <CollapsibleView collapsed={!lists.some((l) => l.name === createListText)}>
                      <HelperText
                        type="error"
                        visible={lists.some((l) => l.name === createListText)}
                      >
                        Une liste avec ce nom existe déjà
                      </HelperText>
                    </CollapsibleView>
                  </CollapsibleView>
                  <Divider />
                  <View style={styles.contentContainer}>
                    <Button
                      mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
                      color={colors.primary}
                      uppercase={Platform.OS !== 'ios'}
                      onPress={() => {
                        if (!createList) {
                          setListModalVisible(false);
                          addArticleToList(id, list);
                        } else if (createListText === '') {
                          setErrorVisible(true);
                        } else if (!lists.some((l) => l.name === createListText)) {
                          addArticleList(createListText);
                          setCreateList(false);
                          setCreateListText('');
                        }
                      }}
                      style={{ flex: 1 }}
                    >
                      {createList ? 'Créer la liste' : 'Ajouter'}
                    </Button>
                  </View>
                </View>
              );
            }}
            keyExtractor={(item) => item.id}
          />
        </Card>
      </Modal>
      <Modal
        isVisible={isCommentModalVisible}
        avoidKeyboard
        onBackdropPress={() => setCommentModalVisible(false)}
        onBackButtonPress={() => setCommentModalVisible(false)}
        onSwipeComplete={() => setCommentModalVisible(false)}
        swipeDirection={['down']}
        style={styles.bottomModal}
      >
        <Card>
          {reqState.comments.add.error && (
            <ErrorMessage
              type="axios"
              strings={{
                what: 'l&apos;ajout du commentaire',
                contentSingular: 'Le commentaire',
              }}
              error={reqState.comments.add.error}
              retry={submitComment}
            />
          )}
          <View style={articleStyles.activeCommentContainer}>
            <TextInput
              // TODO: Hook up comments to drafts in redux, so the user sees his comment when he leaves and comes back.
              // Could possibly also hook it up to drafts with the server in the future.
              autoFocus
              placeholder="Écrire un commentaire..."
              placeholderTextColor={colors.disabled}
              style={articleStyles.commentInput}
              multiline
              value={commentText}
              onChangeText={setCommentText}
            />
          </View>
          <Divider style={articleStyles.divider} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View>
              <CategoriesList
                categories={publishers}
                selected={publisher}
                setSelected={setPublisher}
              />
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <Text style={{ color: commentCharCountColor }}>
                {commentText.length}/{config.comments.maxCharacters}
              </Text>

              {reqState.comments.add.loading ? (
                <ActivityIndicator
                  size="large"
                  color={colors.primary}
                  style={{ marginHorizontal: 7 }}
                />
              ) : (
                <PlatformIconButton
                  color={tooManyChars || commentText.length < 1 ? colors.disabled : colors.primary}
                  icon="send"
                  onPress={tooManyChars || commentText.length < 1 ? null : submitComment}
                  style={{ padding: 0 }}
                />
              )}
            </View>
          </View>
        </Card>
      </Modal>
    </View>
  );
}

const mapStateToProps = (state: State) => {
  const { articles, comments, account } = state;
  return {
    articles: articles.data,
    comments: comments.data,
    reqState: { articles: articles.state, comments: comments.state },
    lists: articles.lists,
    account,
  };
};

export default connect(mapStateToProps)(ArticleDisplay);

ArticleDisplay.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      image: PropTypes.shape(),
      description: PropTypes.string,
      content: PropTypes.shape({
        parser: PropTypes.string,
        data: PropTypes.string,
      }),
      author: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
      }).isRequired,
      group: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
      }),
    }),
  ).isRequired,
  reqState: PropTypes.shape({
    articles: PropTypes.shape({
      info: PropTypes.shape({
        loading: PropTypes.bool,
        error: PropTypes.object, // TODO: Better PropTypes
        success: PropTypes.bool,
      }),
    }).isRequired,
    comments: PropTypes.shape({
      list: PropTypes.shape({
        loading: PropTypes.shape({
          refresh: PropTypes.bool,
          next: PropTypes.bool,
        }),
        error: PropTypes.object,
      }),
    }).isRequired,
  }).isRequired,
  account: PropTypes.shape({
    loggedIn: PropTypes.bool.isRequired,
    accountInfo: PropTypes.shape({
      user: PropTypes.shape({
        info: PropTypes.shape({
          username: PropTypes.string.isRequired,
        }).isRequired,
        data: PropTypes.shape({
          following: PropTypes.shape({
            users: PropTypes.array,
            groups: PropTypes.array,
          }),
        }),
      }),
    }),
  }).isRequired,
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
};

ArticleDisplayHeader.propTypes = {
  article: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    image: PropTypes.shape(),
    description: PropTypes.string,
    content: PropTypes.shape({
      parser: PropTypes.string,
      data: PropTypes.string,
    }),
    author: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    }).isRequired,
    group: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    }).isRequired,
    preload: PropTypes.bool,
  }).isRequired,
  reqState: PropTypes.shape({
    articles: PropTypes.shape({
      info: PropTypes.shape({
        loading: PropTypes.bool,
        error: PropTypes.object, // TODO: Better PropTypes
        success: PropTypes.bool,
      }),
    }).isRequired,
    comments: PropTypes.shape({
      list: PropTypes.shape({
        loading: PropTypes.shape({
          refresh: PropTypes.bool,
          next: PropTypes.bool,
        }),
        error: PropTypes.object,
      }),
    }).isRequired,
  }).isRequired,
  account: PropTypes.shape({
    loggedIn: PropTypes.bool.isRequired,
    accountInfo: PropTypes.shape({
      user: PropTypes.shape({
        info: PropTypes.shape({
          username: PropTypes.string.isRequired,
        }).isRequired,
        data: PropTypes.shape({
          following: PropTypes.shape({
            users: PropTypes.array,
            groups: PropTypes.array,
          }),
        }),
      }),
    }),
  }).isRequired,
};
