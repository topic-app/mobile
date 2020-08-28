import React from 'react';
import { Text, Title, Divider, List, useTheme, Card, Button } from 'react-native-paper';
import { View, Image, ActivityIndicator, Animated, Platform, Share } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import moment from 'moment';
import shortid from 'shortid';

import {
  Article,
  ArticlePreload,
  State,
  CommentRequestState,
  Account,
  ArticleRequestState,
  Comment,
  ArticleListItem,
  Preferences,
} from '@ts/types';
import {
  ErrorMessage,
  Content,
  TagList,
  InlineCard,
  CategoryTitle,
  AnimatingHeader,
  Illustration,
  ReportModal,
} from '@components/index';
import { getImageUrl, handleUrl } from '@utils/index';
import { articleReport, articleVerificationApprove } from '@redux/actions/apiActions/articles';
import { fetchArticle, fetchArticleVerification } from '@redux/actions/api/articles';
import { addArticleRead, addArticleToList } from '@redux/actions/contentData/articles';
import { updateComments } from '@redux/actions/api/comments';
import { commentAdd, commentReport } from '@redux/actions/apiActions/comments';
import getStyles from '@styles/Styles';

import CommentInlineCard from '../../components/Comment';
import AddCommentModal from '../../components/AddCommentModal';
import AddToListModal from '../../components/AddToListModal';
import getArticleStyles from '../styles/Styles';
import type { ArticleDisplayStackParams } from '../index';

// Common types
type Navigation = StackNavigationProp<ArticleDisplayStackParams, 'Display'>;
type Route = RouteProp<ArticleDisplayStackParams, 'Display'>;
type CombinedReqState = {
  articles: ArticleRequestState;
  comments: CommentRequestState;
};

type ArticleDisplayHeaderProps = {
  article: Article | ArticlePreload;
  offline: boolean;
  navigation: Navigation;
  reqState: CombinedReqState;
  account: Account;
  verification: boolean;
  setCommentModalVisible: (visible: boolean) => void;
  setArticleReportModalVisible: (visible: boolean) => void;
};

const ArticleDisplayHeader: React.FC<ArticleDisplayHeaderProps> = ({
  article,
  navigation,
  reqState,
  account,
  setCommentModalVisible,
  setArticleReportModalVisible,
  offline,
  verification,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  const following = account.accountInfo?.user?.data.following;

  return (
    <View style={styles.page}>
      {article.image?.image && (
        <Image
          source={{ uri: getImageUrl({ image: article.image, size: 'large' }) }}
          style={[styles.image, articleStyles.image]}
        />
      )}
      <View style={styles.contentContainer}>
        <Title style={styles.title}>{article.title}</Title>
        <Text style={styles.subtitle}>
          Le {moment(article.date).format('LL')} à {moment(article.date).format('LT')}
        </Text>
      </View>
      <TagList item={article} />
      {offline && (
        <View
          style={[
            styles.contentContainer,
            { flexDirection: 'row', marginBottom: 0, alignItems: 'center' },
          ]}
        >
          <Icon
            style={{ marginRight: 10 }}
            color={colors.disabled}
            size={24}
            name="cloud-off-outline"
          />
          <Title style={{ color: colors.disabled }}>Hors ligne</Title>
        </View>
      )}
      {reqState.articles.info.loading && <ActivityIndicator size="large" color={colors.primary} />}
      {!article.preload && reqState.articles.info.success && (
        <View>
          <View style={styles.contentContainer}>
            <Content data={article.content.data} parser={article.content.parser} />
          </View>
          <Divider />
          <View style={styles.container}>
            <CategoryTitle>Auteur{article.authors?.length > 1 ? 's' : ''}</CategoryTitle>
          </View>
          {article.authors?.map((author) => (
            <InlineCard
              key={author?._id}
              avatar={author.info?.avatar}
              title={author?.displayName}
              onPress={() =>
                navigation.push('Main', {
                  screen: 'Display',
                  params: {
                    screen: 'User',
                    params: {
                      screen: 'Display',
                      params: { id: author?._id, title: author?.displayName },
                    },
                  },
                })
              }
              badge={
                account.loggedIn &&
                account.accountInfo.user &&
                following?.users.includes(author._id)
                  ? 'account-heart'
                  : undefined
              }
              badgeColor={colors.valid}
              // TODO: Add imageUrl: imageUrl={article.author.imageUrl}
              // also need to add subtitle with username/handle: subtitle={article.author.username or .handle}
            />
          ))}
          key={author?._id}
          <View style={styles.container}>
            <CategoryTitle>Groupe</CategoryTitle>
          </View>
          <InlineCard
            avatar={article.group?.avatar}
            title={article.group?.displayName}
            subtitle={`Groupe ${article.group?.type}`}
            onPress={() =>
              navigation.push('Main', {
                screen: 'Display',
                params: {
                  screen: 'Group',
                  params: {
                    screen: 'Display',
                    params: { id: article.group?._id, title: article.group?.displayName },
                  },
                },
              })
            }
            badge={
              account.loggedIn &&
              account.accountInfo.user &&
              following?.groups.includes(article.group?._id)
                ? 'account-heart'
                : null
            }
            badgeColor={colors.valid}
          />
          {!verification && (
            <View>
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
          {verification && (
            <View>
              <View style={[styles.container, { marginTop: 40 }]}>
                <Card
                  elevation={0}
                  style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 5 }}
                >
                  <View style={[styles.container, { flexDirection: 'row' }]}>
                    <Icon
                      name="shield-alert-outline"
                      style={{ alignSelf: 'flex-start', marginRight: 10 }}
                      size={24}
                      color={colors.primary}
                    />
                    <Text style={{ color: colors.text }}>
                      Pour vérifier cet article:{'\n'}- Vérifiez que le contenu est bien conforme
                      aux conditions générales d'utilisation{'\n'}- Vérifiez que tous les médias
                      sont conformes, et que vous avez bien le droit d'utiliser ceux-ci{'\n'}-
                      Visitez chacun des liens afin de vous assurer que tous les sites sont
                      conformes{'\n'}
                      {'\n'}
                      Nous vous rappelons que les contenus suivants ne sont pas autorisés: {'\n'}-
                      Tout contenu illégal{'\n'}- Tout contenu haineux ou discriminatoire{'\n'}-
                      Tout contenu à caractère pornographique ou qui ne convient pas aux enfants
                      {'\n'}- Toute atteinte à la propriété intellectuelle{'\n'}- Tout contenu
                      trompeur{'\n'}- Toute atteinte à la vie privée{'\n'}- Tout contenu publié de
                      façon automatisée
                      {'\n'}- Tout contenu qui pointe vers un site web, logiciel, ou autre média qui
                      ne respecte pas les présentes règles{'\n'}
                      {'\n'}
                      En tant qu'administrateur, vous êtes en partie responsable des contenus
                      publiés, comme détaillé dans la Charte des administrateurs.
                    </Text>
                  </View>
                </Card>
              </View>
              {article?.content?.data?.match(/(?:(?:https?|http):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+/g)
                ?.length && (
                <View style={[styles.container, { marginTop: 20 }]}>
                  <Card
                    elevation={0}
                    style={{ borderColor: colors.disabled, borderWidth: 1, borderRadius: 5 }}
                  >
                    <View style={[styles.container, { flexDirection: 'row' }]}>
                      <Icon
                        name="link"
                        style={{ alignSelf: 'flex-start', marginRight: 10 }}
                        size={24}
                        color={colors.disabled}
                      />
                      <Text style={{ color: colors.text }}>
                        Liens contenus dans l'article:{'\n'}
                        {article?.content?.data
                          ?.match(/(?:(?:https?|http):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+/g)
                          ?.map((u) => (
                            <Text
                              key={shortid()}
                              style={{ textDecorationLine: 'underline' }}
                              onPress={() => handleUrl(u)}
                            >
                              {u}
                              {'\n'}
                            </Text>
                          ))}
                      </Text>
                    </View>
                  </Card>
                </View>
              )}
              {reqState.articles.verification_approve?.error && (
                <ErrorMessage
                  type="axios"
                  strings={{
                    what: "l'approbation de l'article",
                    contentSingular: "l'article",
                  }}
                  error={reqState.articles.verification_approve?.error}
                  retry={() =>
                    articleVerificationApprove(article?._id).then(() => navigation.goBack())
                  }
                />
              )}
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <View style={[styles.container]}>
                  <Button
                    mode="outlined"
                    color={colors.invalid}
                    contentStyle={{
                      height: 50,
                      alignSelf: 'stretch',
                      justifyContent: 'center',
                    }}
                    onPress={() => setArticleReportModalVisible(true)}
                  >
                    Signaler
                  </Button>
                </View>
                <View style={styles.container}>
                  <Button
                    mode="contained"
                    loading={reqState.articles.verification_approve?.loading}
                    color={colors.valid}
                    contentStyle={{
                      height: 50,
                      justifyContent: 'center',
                    }}
                    onPress={() =>
                      articleVerificationApprove(article?._id).then(() => navigation.goBack())
                    }
                  >
                    Approuver
                  </Button>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

type ArticleDisplayProps = {
  route: Route;
  navigation: Navigation;
  item: Article | null;
  data: Article[];
  search: Article[];
  comments: Comment[];
  reqState: CombinedReqState;
  account: Account;
  lists: ArticleListItem[];
  preferences: Preferences;
};

const ArticleDisplay: React.FC<ArticleDisplayProps> = ({
  route,
  navigation,
  data,
  search,
  item,
  comments,
  reqState,
  account,
  preferences,
  lists,
}) => {
  // Pour changer le type de route.params, voir ../index.tsx
  const { id, useLists = false, verification = false } = route.params;

  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  let article: Article | undefined | null;
  if (useLists && lists?.some((l: ArticleListItem) => l.items?.some((i) => i._id === id))) {
    article = lists
      .find((l: ArticleListItem) => l.items.some((i) => i._id === id))
      ?.items.find((i) => i._id === id);
  } else {
    article =
      item?._id === id
        ? item
        : data.find((a) => a._id === id) || search.find((a) => a._id === id) || null;
  }
  const articleComments = comments.filter((c) => c.parent === article?._id);

  const fetch = () => {
    if (!(useLists && lists?.some((l: ArticleListItem) => l.items?.some((i) => i._id === id)))) {
      if (verification) {
        fetchArticleVerification(id);
      } else {
        fetchArticle(id).then(() => {
          if (preferences.history) {
            addArticleRead(id, article?.title);
          }
        });
      }
    }
  };

  React.useEffect(() => {
    fetch();
    updateComments('initial', { parentId: id });
  }, [null]);

  const [isCommentModalVisible, setCommentModalVisible] = React.useState(false);
  const [isArticleReportModalVisible, setArticleReportModalVisible] = React.useState(false);
  const [isListModalVisible, setListModalVisible] = React.useState(false);

  const [isCommentReportModalVisible, setCommentReportModalVisible] = React.useState(false);
  const [focusedComment, setFocusedComment] = React.useState(null);

  const scrollY = new Animated.Value(0);

  if (!article) {
    // This is when article has not been loaded in list, so we have absolutely no info
    return (
      <View style={styles.page}>
        <AnimatingHeader
          value={scrollY}
          title={
            route.params.title ||
            (useLists && lists?.some((l) => l.items?.some((i) => i._id === id))
              ? 'Actus - Hors ligne'
              : verification
              ? 'Actus - modération'
              : 'Actus')
          }
          subtitle={
            route.params.title &&
            (useLists && lists?.some((l) => l.items?.some((i) => i._id === id))
              ? 'Actus - Hors ligne'
              : verification
              ? 'Actus - modération'
              : 'Actus')
          }
        />
        {reqState.articles.info.error && (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la récupération de cet article',
              contentSingular: "L'article",
            }}
            error={reqState.articles.info.error}
            retry={fetch}
          />
        )}
        {reqState.articles.info.loading && (
          <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </View>
    );
  }
  return (
    <View style={styles.page}>
      <AnimatingHeader
        value={scrollY}
        title={
          route.params.title ||
          (useLists && lists?.some((l) => l.items?.some((i) => i._id === id))
            ? 'Actus - Hors ligne'
            : verification
            ? 'Actus - modération'
            : 'Actus')
        }
        subtitle={
          route.params.title &&
          (useLists && lists?.some((l) => l.items?.some((i) => i._id === id))
            ? 'Actus - Hors ligne'
            : verification
            ? 'Actus - modération'
            : 'Actus')
        }
        actions={
          verification
            ? undefined
            : [
                {
                  icon: 'playlist-plus',
                  onPress: () => setListModalVisible(true),
                },
              ]
        }
        overflow={
          verification
            ? undefined
            : [
                {
                  title: 'Partager',
                  onPress:
                    Platform.OS === 'ios'
                      ? () =>
                          Share.share({
                            message: `${article?.title} par ${article?.group?.displayName}`,
                            url: `https://go.topicapp.fr/articles/${article?._id}`,
                          })
                      : () =>
                          Share.share({
                            message: `https://go.topicapp.fr/articles/${article?._id}`,
                            title: `${article?.title} par ${article?.group?.displayName}`,
                          }),
                },
                {
                  title: 'Signaler',
                  onPress: () => setArticleReportModalVisible(true),
                },
              ]
        }
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
            verification={verification}
            offline={useLists && lists?.some((l) => l.items?.some((i) => i._id === id))}
            reqState={reqState}
            account={account}
            navigation={navigation}
            setCommentModalVisible={setCommentModalVisible}
            setArticleReportModalVisible={setArticleReportModalVisible}
          />
        )}
        data={reqState.articles.info.success && !verification ? articleComments : []}
        refreshing={reqState.comments.list.loading.refresh}
        onRefresh={() => {
          if (useLists && lists?.some((l) => l.items?.some((i) => i._id === id))) {
            fetchArticle(id);
          } else {
            addArticleToList(id, lists.find((l) => l.items.some((i) => i._id === id))?.id);
          }
          updateComments('refresh', { parentId: id });
        }}
        // onEndReached={() => {
        //   console.log('comment end reached');
        //   updateComments('next', { parentId: id });
        // }}
        // onEndReachedThreshold={0.5}
        keyExtractor={(comment: Comment) => comment._id}
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
          ) : undefined
        }
        ListEmptyComponent={() =>
          reqState.comments.list.success &&
          reqState.articles.info.success &&
          !verification && (
            <View style={styles.contentContainer}>
              <View style={styles.centerIllustrationContainer}>
                <Illustration name="comment-empty" height={200} width={200} />
                <Text>Aucun commentaire</Text>
              </View>
            </View>
          )
        }
        renderItem={({ item }: { item: Comment }) => (
          <CommentInlineCard
            comment={item}
            report={(id) => {
              setFocusedComment(id);
              setCommentReportModalVisible(true);
            }}
            loggedIn={account.loggedIn}
            navigation={navigation}
          />
        )}
      />
      <AddCommentModal
        visible={isCommentModalVisible}
        setVisible={setCommentModalVisible}
        id={id}
        reqState={reqState}
        add={(...data: any) =>
          commentAdd(...data).then(() => updateComments('initial', { parentId: id }))
        }
      />
      <ReportModal
        visible={isArticleReportModalVisible}
        setVisible={setArticleReportModalVisible}
        contentId={id}
        report={articleReport}
        state={reqState.articles.report}
      />
      <ReportModal
        visible={isCommentReportModalVisible}
        setVisible={setCommentReportModalVisible}
        contentId={focusedComment}
        report={commentReport}
        state={reqState.comments.report}
        navigation={navigation}
      />
      <AddToListModal
        visible={isListModalVisible}
        setVisible={setListModalVisible}
        id={id}
        type="article"
      />
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { articles, articleData, comments, account, preferences } = state;
  return {
    data: articles.data,
    search: articles.search,
    item: articles.item,
    comments: comments.data,
    reqState: { articles: articles.state, comments: comments.state },
    preferences,
    lists: articleData.lists,
    account,
  };
};

export default connect(mapStateToProps)(ArticleDisplay);
