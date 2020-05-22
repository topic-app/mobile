import React from 'react';
import PropTypes from 'prop-types';
import { Text, ProgressBar, Divider, List, Button, withTheme } from 'react-native-paper';
import {
  View,
  ImageBackground,
  ScrollView,
  Platform,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import ErrorMessage from '@components/ErrorMessage';
import moment from 'moment';

import Content from '@components/Content';
import TagList from '@components/TagList';
import getStyles from '@styles/Styles';
import { fetchArticle } from '@redux/actions/api/articles';
import { updateComments } from '@redux/actions/api/comments';

function ArticleDisplay({ route, articles, comments, state, commentState, theme, account }) {
  const { id } = route.params;
  let article = {};
  React.useEffect(() => {
    fetchArticle(id);
    updateComments('initial', { parentId: id });
  }, [id]);

  const styles = getStyles(theme);
  const { colors } = theme;

  article = articles.find((t) => t._id === id);

  if (!article) {
    // This is when article has not been loaded in list, so we have absolutely no info
    return (
      <View style={styles.page}>
        <ProgressBar indeterminate />
      </View>
    );
  }
  return (
    <View style={styles.page}>
      {state.info.error ? (
        <ErrorMessage
          type="axios"
          strings={{
            what: 'la récupération de cet article',
            contentSingular: "L'article",
          }}
          error={state.info.error}
          retry={() => fetchArticle(id)}
        />
      ) : null}
      <ScrollView>
        {article.imageUrl ? (
          <ImageBackground
            source={{ uri: article.thumbnailUrl }}
            style={[styles.image, { height: 250 }]}
          >
            {(article.preload || state.info.loading) && !state.info.error && (
              <ProgressBar indeterminate />
            )}
          </ImageBackground>
        ) : (
          (article.preload || state.info.loading) &&
          !state.info.error && <ProgressBar indeterminate />
        )}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.subtitle}>
            Le {moment(article.date).format('LLL')} par {article.group.displayName}
          </Text>
        </View>
        <TagList type="article" item={article} />
        {!article.preload && (
          <View>
            <View style={styles.contentContainer}>
              <Content data={article.content.data} parser={article.content.parser} />
            </View>
            <Divider />
            <List.Item
              title={`Auteur: ${article.author.displayName}`}
              right={() => {
                if (account.loggedIn && account.accountInfo.user) {
                  if (account.accountInfo.user.data.following.users.includes(article.author._id)) {
                    return (
                      <Button
                        mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                        uppercase={Platform.OS !== 'ios'}
                        disabled
                      >
                        Suivi
                      </Button>
                    );
                  }
                  return (
                    <Button
                      mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                      uppercase={Platform.OS !== 'ios'}
                    >
                      Suivre
                    </Button>
                  );
                }
                return null;
              }}
            />
            <Divider />
            <List.Item
              title={`Groupe: ${article.group.displayName}`}
              right={() => {
                if (account.loggedIn && account.accountInfo.user) {
                  if (account.accountInfo.user.data.following.groups.includes(article.group._id)) {
                    return (
                      <Button
                        mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                        uppercase={Platform.OS !== 'ios'}
                        disabled
                      >
                        Suivi
                      </Button>
                    );
                  }
                  return (
                    <Button
                      mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                      uppercase={Platform.OS !== 'ios'}
                    >
                      Suivre
                    </Button>
                  );
                }
                return null;
              }}
            />
            <Divider />
            <List.Item
              title="Écrire un commentaire"
              titleStyle={{ color: colors.disabled }}
              right={() => <List.Icon icon="send" />}
            />
            <Divider />
            <View>
              {commentState.error ? (
                <ErrorMessage
                  type="axios"
                  strings={{
                    what: 'la récupération des commentaires',
                    contentPlural: 'des commentaires',
                  }}
                  error={commentState.error}
                  retry={() => updateComments('initial', { parentId: id })}
                />
              ) : null}
              {/* <FlatList
                data={comments}
                refreshing={commentState.loading.refresh}
                onRefresh={() => updateComments('refresh', { parentId: id })}
                onEndReached={() => updateComments('next', { parentId: id })}
                onEndReachedThreshold={0.5}
                keyExtractor={(comment) => comment._id}
                ListFooterComponent={
                  <View style={[styles.container, { height: 50 }]}>
                    {commentState.loading.next ?? (
                      <ActivityIndicator size="large" color={colors.primary} />
                    )}
                  </View>
                }
                renderItem={(comment) => <Text>{JSON.stringify(comment)}</Text>}
              /> */}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const mapStateToProps = (state) => {
  const { articles, comments, account } = state;
  return {
    articles: articles.data,
    comments: comments.data,
    state: articles.state,
    commentState: comments.state,
    account,
  };
};

export default connect(mapStateToProps)(withTheme(ArticleDisplay));

ArticleDisplay.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      thumbnailUrl: PropTypes.string,
      description: PropTypes.string,
      content: PropTypes.shape({
        parser: PropTypes.string,
        data: PropTypes.string,
      }),
      group: PropTypes.shape({
        displayName: PropTypes.string,
      }),
    }).isRequired,
  ).isRequired,
  state: PropTypes.shape({
    info: PropTypes.shape({
      loading: PropTypes.bool,
      error: PropTypes.oneOf([PropTypes.object, null]), // TODO: Better PropTypes
    }),
  }).isRequired,
  account: PropTypes.shape({
    loggedIn: PropTypes.bool.isRequired,
    accountInfo: PropTypes.shape({
      user: PropTypes.shape({
        data: PropTypes.shape({
          following: PropTypes.shape({
            users: PropTypes.arrayOf(),
            groups: PropTypes.arrayOf(),
          }),
        }),
      }),
    }),
  }).isRequired,
  comments: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  commentState: PropTypes.shape({
    loading: PropTypes.shape({
      refresh: PropTypes.bool,
      next: PropTypes.bool,
    }),
    error: PropTypes.oneOf(PropTypes.shape(), null),
  }).isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      text: PropTypes.string.isRequired,
      disabled: PropTypes.string.isRequired,
      primary: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
