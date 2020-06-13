import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Text, ProgressBar, Divider, List, useTheme, Chip } from 'react-native-paper';
import { View, Image, TextInput, ActivityIndicator, Animated } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';

import { config } from '@root/app.json';
import ErrorMessage from '@components/ErrorMessage';
import Content from '@components/Content';
import TagList from '@components/TagList';
import { InlineCard } from '@components/Cards';
import CollapsibleView from '@components/CollapsibleView';
import { PlatformIconButton } from '@components/PlatformComponents';
import { CategoryTitle } from '@components/Typography';
import AnimatingHeader from '@components/AnimatingHeader';
import { fetchArticle } from '@redux/actions/api/articles';
import { updateComments } from '@redux/actions/api/comments';
import getStyles from '@styles/Styles';
import { getImageUrl } from '@utils/getAssetUrl';

import CommentInlineCard from '../components/Comment';
import getArticleStyles from '../styles/Styles';

function ArticleDisplayHeader({ article, reqState, account }) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  const [commentText, setCommentText] = useState('');
  const [commentActive, setCommentActive] = useState(false);

  const expandCommentInput = () => setCommentActive(true);
  const collapseCommentInput = () => setCommentActive(false);

  const { following } = account?.accountInfo?.user?.data || {};

  const tooManyChars = commentText.length > config.comments.maxCharacters;

  let commentCharCountColor = colors.softContrast;
  if (tooManyChars) {
    commentCharCountColor = colors.error;
  } else if (commentText.length > 0.9 * config.comments.maxCharacters) {
    commentCharCountColor = colors.warning;
  }

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
          <CollapsibleView collapsed={commentActive}>
            <List.Item
              title="Écrire un commentaire"
              titleStyle={articleStyles.placeholder}
              right={() => <List.Icon icon="comment-plus" color={colors.icon} />}
              onPress={expandCommentInput}
            />
          </CollapsibleView>
          <CollapsibleView collapsed={!commentActive}>
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
                onBlur={commentText === '' ? collapseCommentInput : null}
              />
              <Divider style={articleStyles.divider} />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View>
                  <Chip mode="outlined" icon="account">
                    {
                      account.accountInfo.user.info.username
                      // TODO: use some sort of displayName here with an @handle
                    }
                  </Chip>
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

                  <PlatformIconButton
                    color={tooManyChars ? colors.disabled : colors.primary}
                    icon="send"
                    onPress={tooManyChars ? null : () => console.log('send')}
                    style={{ padding: 0 }}
                  />
                </View>
              </View>
            </View>
          </CollapsibleView>
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
}

function ArticleDisplay({ route, navigation, articles, comments, reqState, account }) {
  const { id } = route.params;
  React.useEffect(() => {
    fetchArticle(id);
    updateComments('initial', { parentId: id });
  }, [id]);

  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const article = articles.find((t) => t._id === id) || {};
  const articleComments = comments.filter((c) => c.parent === article._id);

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
            icon: 'magnify',
            onPress: () =>
              navigation.navigate('Main', {
                screen: 'Search',
                params: {
                  screen: 'Search',
                  params: { initialCategory: 'events', previous: 'Évènements' },
                },
              }),
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
        {(article.preload || reqState.articles.info.loading) && !reqState.articles.info.error && (
          <ProgressBar indeterminate />
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
          />
        )}
        data={reqState.articles.info.success ? articleComments : []}
        refreshing={reqState.comments.list.loading.refresh}
        onRefresh={() => {
          console.log('comment refresh');
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
        renderItem={({ item }) => <CommentInlineCard comment={item} />}
      />
    </View>
  );
}

const mapStateToProps = (state) => {
  const { articles, comments, account } = state;
  return {
    articles: articles.data,
    comments: comments.data,
    reqState: { articles: articles.state, comments: comments.state },
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
