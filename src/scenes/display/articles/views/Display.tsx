import { RouteProp } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import { View, ActivityIndicator, Animated, Platform, Share } from 'react-native';
import { Text, Title, Divider, List, Card, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import shortid from 'shortid';

import {
  ErrorMessage,
  Content,
  TagList,
  InlineCard,
  CategoryTitle,
  AnimatingHeader,
  Illustration,
  ReportModal,
  PlatformTouchable,
} from '@components/index';
import config from '@constants/config';
import { Permissions } from '@constants/index';
import {
  fetchArticle,
  fetchArticleMy,
  fetchArticleVerification,
} from '@redux/actions/api/articles';
import { updateComments } from '@redux/actions/api/comments';
import {
  articleReport,
  articleVerificationApprove,
  articleDelete,
  articleLike,
} from '@redux/actions/apiActions/articles';
import { commentAdd, commentReport } from '@redux/actions/apiActions/comments';
import { addArticleRead } from '@redux/actions/contentData/articles';
import getStyles from '@styles/Styles';
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
  Content as ContentType,
  ArticleMyInfo,
} from '@ts/types';
import AutoHeightImage from '@utils/autoHeightImage';
import { useTheme, getImageUrl, handleUrl, checkPermission, Alert, Errors } from '@utils/index';

import AddCommentModal from '../../components/AddCommentModal';
import AddToListModal from '../../components/AddToListModal';
import CommentInlineCard from '../../components/Comment';
import type { ArticleDisplayScreenNavigationProp, ArticleDisplayStackParams } from '../index';
import getArticleStyles from '../styles/Styles';

// Common types
type Navigation = ArticleDisplayScreenNavigationProp<'Display'>;
type Route = RouteProp<ArticleDisplayStackParams, 'Display'>;

type CombinedReqState = {
  articles: ArticleRequestState;
  comments: CommentRequestState;
};

type ArticleDisplayHeaderProps = {
  article: Article | ArticlePreload;
  articleMy: ArticleMyInfo | null;
  offline: boolean;
  navigation: Navigation;
  reqState: CombinedReqState;
  account: Account;
  commentsDisplayed: boolean;
  verification: boolean;
  setReplyingToComment: (id: string | null) => any;
  setCommentModalVisible: (visible: boolean) => void;
  setArticleReportModalVisible: (visible: boolean) => void;
};

const ArticleDisplayHeader: React.FC<ArticleDisplayHeaderProps> = ({
  article,
  articleMy,
  navigation,
  reqState,
  account,
  commentsDisplayed,
  setCommentModalVisible,
  setArticleReportModalVisible,
  setReplyingToComment,
  offline,
  verification,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  const following = account.accountInfo?.user?.data.following;

  const [imageWidth, setImageWidth] = React.useState(0);

  const approveArticle = () =>
    articleVerificationApprove(article._id)
      .then(() => navigation.goBack())
      .catch((error) =>
        Errors.showPopup({
          type: 'axios',
          what: "l'approbation de l'article",
          error,
          retry: approveArticle,
        }),
      );

  const likeArticle = () => {
    articleLike(article._id, !articleMy?.liked)
      .then(() => {
        fetchArticleMy(article._id);
      })
      .catch((error) =>
        Errors.showPopup({
          type: 'axios',
          what: 'la prise en compte du like',
          error,
          retry: () => likeArticle(),
        }),
      );
  };

  return (
    <View style={styles.page}>
      {article.image?.image && (
        <View onLayout={({ nativeEvent }) => setImageWidth(nativeEvent.layout.width)}>
          <PlatformTouchable
            onPress={() =>
              navigation.push('Root', {
                screen: 'Main',
                params: {
                  screen: 'Display',
                  params: {
                    screen: 'Image',
                    params: {
                      screen: 'Display',
                      params: { image: article.image },
                    },
                  },
                },
              })
            }
          >
            <AutoHeightImage
              source={{ uri: getImageUrl({ image: article.image, size: 'full' }) || '' }}
              width={imageWidth}
              maxHeight={400}
              style={[styles.image, { minHeight: 150 }]}
            />
          </PlatformTouchable>
        </View>
      )}
      <View style={styles.contentContainer}>
        <Title style={styles.title}>{article.title}</Title>
        <Text style={styles.subtitle}>
          Le {moment(article.date).format('LL')} à {moment(article.date).format('LT')}
        </Text>
      </View>
      <TagList item={article} scrollable />
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
      {(reqState.articles.info.loading || reqState.articles.delete?.loading) && (
        <ActivityIndicator size="large" color={colors.primary} />
      )}
      {!article.preload && reqState.articles.info.success && article.content && (
        <View>
          <View style={styles.contentContainer}>
            <Content data={article.content?.data} parser={article.content?.parser} />
          </View>
          {!verification && (
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 10,
                marginHorizontal: 10,
                justifyContent: 'space-around',
              }}
            >
              <Button
                mode="text"
                icon={articleMy?.liked ? 'thumb-up' : 'thumb-up-outline'}
                loading={reqState.articles.my?.loading || reqState.articles.like?.loading}
                style={{ flex: 1, marginRight: 5 }}
                color={articleMy?.liked ? colors.primary : colors.muted}
                onPress={account.loggedIn ? likeArticle : undefined}
              >
                {typeof article.cache?.likes === 'number'
                  ? article.cache.likes + (articleMy?.liked ? 1 : 0)
                  : ''}{' '}
                Likes
              </Button>
              <Button
                mode="text"
                icon="share-variant"
                style={{ flex: 1, marginLeft: 5 }}
                color={colors.muted}
                onPress={Platform.select({
                  ios: () =>
                    Share.share({
                      message: `${article?.title} par ${article.group?.displayName}`,
                      url: `${config.links.share}/articles/${article._id}`,
                    }),
                  android: () =>
                    Share.share({
                      message: `${config.links.share}/articles/${article._id}`,
                      title: `${article?.title} par ${article.group?.displayName}`,
                    }),
                  default: () =>
                    Share.share({
                      message: '',
                      title: `${article?.title} par ${article.group?.displayName} ${config.links.share}/articles/${article._id}`,
                    }),
                })}
              >
                Partager
              </Button>
            </View>
          )}
          <Divider />
          <View style={styles.container}>
            <CategoryTitle>Auteur{article.authors?.length > 1 ? 's' : ''}</CategoryTitle>
          </View>
          {article.authors?.map((author) => (
            <InlineCard
              key={author._id}
              avatar={author.info?.avatar}
              title={author.displayName}
              subtitle={
                author.displayName === author.info?.username
                  ? undefined
                  : `@${author.info?.username}`
              }
              onPress={() =>
                navigation.push('Root', {
                  screen: 'Main',
                  params: {
                    screen: 'Display',
                    params: {
                      screen: 'User',
                      params: {
                        screen: 'Display',
                        params: { id: author?._id || '' /* title: author?.displayName */ },
                      },
                    },
                  },
                })
              }
              badge={
                account.loggedIn &&
                account.accountInfo?.user &&
                following?.users.some((u) => u._id === author._id)
                  ? 'heart'
                  : undefined
              }
              badgeColor={colors.primary}
              // TODO: Add imageUrl: imageUrl={article.author.imageUrl}
              // also need to add subtitle with username/handle: subtitle={article.author.username or .handle}
            />
          ))}
          <View style={styles.container}>
            <CategoryTitle>Groupe</CategoryTitle>
          </View>
          <InlineCard
            avatar={article.group?.avatar}
            title={article.group?.name || article.group?.displayName}
            subtitle={`Groupe ${article.group?.type}`}
            onPress={() =>
              navigation.push('Root', {
                screen: 'Main',
                params: {
                  screen: 'Display',
                  params: {
                    screen: 'Group',
                    params: {
                      screen: 'Display',
                      params: { id: article.group?._id, title: article.group?.displayName },
                    },
                  },
                },
              })
            }
            badge={
              account.loggedIn &&
              account.accountInfo?.user &&
              following?.groups.some((g) => g._id === article.group?._id)
                ? 'heart'
                : article.group?.official
                ? 'check-decagram'
                : undefined
            }
            badgeColor={colors.primary}
          />
          {!verification && commentsDisplayed && (
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
                    onPress={() => {
                      setReplyingToComment(null);
                      setCommentModalVisible(true);
                    }}
                  />
                </View>
              ) : (
                <View style={styles.contentContainer}>
                  <Text style={articleStyles.disabledText}>
                    Connectez-vous pour écrire un commentaire
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
                      Créer un compte
                    </Text>
                  </Text>
                </View>
              )}
              <Divider />
              <View>
                {(reqState.comments.list.error || reqState.articles.my?.error) && (
                  <ErrorMessage
                    type="axios"
                    strings={{
                      what: 'la récupération des commentaires et des likes',
                      contentPlural: 'des commentaires et des likes',
                    }}
                    error={[reqState.comments.list.error, reqState.articles.my?.error]}
                    retry={() => {
                      updateComments('initial', { parentId: article._id });
                      fetchArticleMy(article._id);
                    }}
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
                    <Text style={{ color: colors.text, flex: 1 }}>
                      Pour vérifier cet article:{'\n'}- Vérifiez que le contenu est bien conforme
                      aux conditions générales d&apos;utilisation{'\n'}- Vérifiez que tous les
                      médias sont conformes et que vous avez bien le droit d&apos;utiliser ceux-ci
                      {'\n'}- Visitez chacun des liens afin de vous assurer que tous les sites sont
                      conformes{'\n'}
                      {'\n'}
                      Nous vous rappelons que les contenus suivants ne sont pas autorisés : {'\n'}-
                      Tout contenu illégal{'\n'}- Tout contenu haineux ou discriminatoire{'\n'}-
                      Tout contenu à caractère pornographique ou qui ne convient pas aux enfants
                      {'\n'}- Toute atteinte à la propriété intellectuelle{'\n'}- Tout contenu
                      trompeur{'\n'}- Toute atteinte à la vie privée{'\n'}- Tout contenu publié de
                      façon automatisée
                      {'\n'}- Tout contenu qui pointe vers un site web, logiciel ou autre média qui
                      ne respecte pas les présentes règles{'\n'}
                      {'\n'}
                      En tant qu&apos;administrateur, vous êtes en partie responsable des contenus
                      publiés, comme détaillé dans la Charte des administrateurs.
                    </Text>
                  </View>
                </Card>
              </View>
              {article.content?.data?.match(/(?:(?:https?|http):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+/g)
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
                        Liens contenus dans l&apos;article:{'\n'}
                        {article.content?.data
                          ?.match(/(?:(?:https?|http):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+/g)
                          ?.map((u: string) => (
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
                    onPress={approveArticle}
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
  my: ArticleMyInfo | null;
  data: ArticlePreload[];
  search: ArticlePreload[];
  comments: Comment[];
  reqState: CombinedReqState;
  account: Account;
  lists: ArticleListItem[];
  preferences: Preferences;
  dual?: boolean;
};

const ArticleDisplay: React.FC<ArticleDisplayProps> = ({
  route,
  navigation,
  data,
  search,
  item,
  my,
  comments,
  reqState,
  account,
  preferences,
  lists,
  dual = false,
}) => {
  // Pour changer le type de route.params, voir ../index.tsx
  const { id, useLists = false, verification = false } = route.params;

  const [commentsDisplayed, setCommentsDisplayed] = React.useState(false);

  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  let article: Article | ArticlePreload | undefined | null;
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
  const articleMy: ArticleMyInfo | null = my?._id === id ? my : null;

  const articleComments = comments.filter(
    (c) =>
      c.parent === id &&
      (c.publisher?.type !== 'user' || c.publisher?.user?._id !== account.accountInfo?.accountId),
  );

  const fetch = () => {
    if (!(useLists && lists?.some((l: ArticleListItem) => l.items?.some((i) => i._id === id)))) {
      if (verification) {
        fetchArticleVerification(id).then(() => setCommentsDisplayed(true));
      } else {
        fetchArticle(id).then(() => {
          if (preferences.history) {
            addArticleRead(id, article?.title || 'Article inconnu');
          }
          setCommentsDisplayed(true);
        });
        if (account.loggedIn) {
          fetchArticleMy(id);
        }
      }
    }
  };

  const deleteArticle = () =>
    articleDelete(id)
      .then(() => {
        navigation.goBack();
        Alert.alert(
          'Article supprimé',
          "Vous pouvez contacter l'équipe Topic au plus tard après deux semaines pour éviter la suppression définitive.",
          [{ text: 'Fermer' }],
          {
            cancelable: true,
          },
        );
      })
      .catch((error) =>
        Errors.showPopup({
          type: 'axios',
          what: "la suppression de l'article",
          error,
          retry: deleteArticle,
        }),
      );

  React.useEffect(() => {
    fetch();
    updateComments('initial', { parentId: id });
  }, [null]);

  const [isCommentModalVisible, setCommentModalVisible] = React.useState(false);
  const [isArticleReportModalVisible, setArticleReportModalVisible] = React.useState(false);
  const [isListModalVisible, setListModalVisible] = React.useState(false);

  const [isCommentReportModalVisible, setCommentReportModalVisible] = React.useState(false);
  const [focusedComment, setFocusedComment] = React.useState<string | null>(null);

  const [replyingToComment, setReplyingToComment] = React.useState<string | null>(null);
  const replyingToPublisher = articleComments.find((c) => c._id === replyingToComment)?.publisher;

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
        hideBack={dual}
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
        overflow={[
          {
            title: 'Partager',
            onPress: Platform.select({
              ios: () =>
                Share.share({
                  message: `${article?.title} par ${article?.group?.displayName}`,
                  url: `${config.links.share}/articles/${article?._id}`,
                }),
              android: () =>
                Share.share({
                  message: `${config.links.share}/articles/${article?._id}`,
                  title: `${article?.title} par ${article?.group?.displayName}`,
                }),
              default: () =>
                Share.share({
                  message: '',
                  title: `${article?.title} par ${article?.group?.displayName} ${config.links.share}/articles/${article?._id}`,
                }),
            }),
          },
          {
            title: 'Signaler',
            onPress: () => setArticleReportModalVisible(true),
          },
          ...(checkPermission(account, {
            permission: Permissions.ARTICLE_DELETE,
            scope: { groups: [article?.group?._id || ''] },
          })
            ? [
                {
                  title: 'Supprimer',
                  onPress: () =>
                    Alert.alert(
                      'Supprimer cette article ?',
                      'Les autres administrateurs du groupe seront notifiés.',
                      [
                        { text: 'Annuler' },
                        {
                          text: 'Supprimer',
                          onPress: deleteArticle,
                        },
                      ],
                      { cancelable: true },
                    ),
                },
              ]
            : []),
        ]}
      >
        {reqState.articles.info.error && (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la récupération de cet article',
              contentSingular: "L'article",
            }}
            error={reqState.articles.info.error}
            retry={() => fetch()}
          />
        )}
      </AnimatingHeader>
      <Animated.FlatList
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        ListHeaderComponent={() =>
          article ? (
            <ArticleDisplayHeader
              article={article}
              articleMy={articleMy}
              commentsDisplayed={commentsDisplayed}
              verification={verification}
              offline={useLists && lists?.some((l) => l.items?.some((i) => i._id === id))}
              reqState={reqState}
              account={account}
              navigation={navigation}
              setReplyingToComment={setReplyingToComment}
              setCommentModalVisible={setCommentModalVisible}
              setArticleReportModalVisible={setArticleReportModalVisible}
            />
          ) : null
        }
        data={
          reqState.articles.info.success && !verification
            ? [...(articleMy?.comments || []), ...articleComments]
            : []
        }
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
          !verification &&
          commentsDisplayed ? (
            <View style={styles.contentContainer}>
              <View style={styles.centerIllustrationContainer}>
                <Illustration name="comment-empty" height={200} width={200} />
                <Text>Aucun commentaire</Text>
              </View>
            </View>
          ) : null
        }
        renderItem={({ item: comment }: { item: Comment }) => (
          <CommentInlineCard
            comment={comment}
            report={(commentId) => {
              setFocusedComment(commentId);
              setCommentReportModalVisible(true);
            }}
            fetch={() => updateComments('initial', { parentId: id })}
            isReply={false}
            loggedIn={account.loggedIn}
            navigation={navigation}
            reply={(id: string | null) => {
              setReplyingToComment(id);
              setCommentModalVisible(true);
            }}
            authors={[...(article?.authors?.map((a) => a._id) || []), article?.group?._id || '']}
          />
        )}
      />
      <AddCommentModal
        visible={isCommentModalVisible}
        setVisible={setCommentModalVisible}
        replyingToComment={replyingToComment}
        setReplyingToComment={setReplyingToComment}
        replyingToUsername={
          replyingToPublisher?.type === 'group'
            ? replyingToPublisher?.group?.shortName || replyingToPublisher?.group?.name
            : replyingToPublisher?.user?.info?.username
        }
        id={id}
        group={article?.group?._id}
        reqState={reqState}
        add={(
          publisher: { type: 'user' | 'group'; user?: string | null; group?: string | null },
          content: ContentType,
          parent: string,
          isReplying: boolean = false,
        ) =>
          commentAdd(publisher, content, parent, isReplying ? 'comment' : 'article').then(() =>
            updateComments('initial', { parentId: id }),
          )
        }
      />
      <ReportModal
        visible={isArticleReportModalVisible}
        setVisible={setArticleReportModalVisible}
        contentId={id}
        report={articleReport}
        state={reqState.articles.report}
        navigation={navigation}
      />
      <ReportModal
        visible={isCommentReportModalVisible}
        setVisible={setCommentReportModalVisible}
        contentId={focusedComment || ''}
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
    my: articles.my,
    comments: comments.data,
    reqState: { articles: articles.state, comments: comments.state },
    preferences,
    lists: articleData.lists,
    account,
  };
};

export default connect(mapStateToProps)(ArticleDisplay);
