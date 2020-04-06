import Store from '../store';
import request from '../../util/request'

/**
 * @docs actionCreators
 * Créateur d'action pour updateArticles
 * @param lastId L'id du dernier article, par ordre chronologique, de la liste d'articles/database redux
 * @returns Action
 */
function updateArticlesCreator(lastId = undefined) {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_ARTICLES',
      data: {
        data: getState().articles.data,
        state: {
          refreshing: true,
          loading: false,
          success: null,
          error: null,
        }
      }
    })
    request('articles/list', 'get', { lastId }).then(result => {
      // console.log(`Result, ${JSON.stringify(result)}`)
      const { data } = getState().articles; // The old articles, in redux db
      result.data.articles.forEach(a => {
        if (data.some(p => p._id === a._id)) {
          data[data.map(p => p._id).indexOf(a._id)] = a;
        } else {
          data.push(a)
        }
      });
      data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
      if (result.success) {
        return dispatch({
          type: 'UPDATE_ARTICLES',
          data: {
            data,
            state: {
              refreshing: false,
              loading: false,
              success: true,
              error: null,
            }
          },
        });
      }
      console.log(`Error, ${result}`);
      return dispatch({
        type: 'UPDATE_ARTICLES',
        data: {
          data: getState().articles.data,
          state: {
            refreshing: false,
            loading: false,
            success: false,
            error: 'server'
          }
        }
      });
    }).catch((err) => {
      return dispatch({
        type: 'UPDATE_ARTICLES',
        data: {
          data: getState().articles.data,
          state: {
            refreshing: false,
            success: false,
            loading: false,
            error: err,
          }
        }
      });
    })
  };
}

/**
 * @docs actionCreators
 * Créateur d'action pour fetchArticle
 * @param articleId L'id de l'article que l'on veut chercher
 * @returns Action
 */
function fetchArticleCreator(articleId) {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_ARTICLES',
      data: {
        data: getState().articles.data,
        state: {
          refreshing: false,
          loading: true,
          success: null,
          error: null,
        }
      }
    })
    request('articles/info', 'get', { articleId }).then(result => {
      // console.log(`Result, ${JSON.stringify(result)}`)
      console.log("Request done")
      const { article } = result;
      console.log(article)
      const { data } = getState().articles; // The old articles, in redux db
      if (data.some(p => p._id === article._id)) {
        data[data.map(p => p._id).indexOf(article._id)] = article;
      } else {
        data.push(article)
      }
      console.log(data)
      data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
      console.log(data)
      if (result.success) {
        return dispatch({
          type: 'UPDATE_ARTICLES',
          data: {
            data,
            state: {
              refreshing: false,
              loading: false,
              success: true,
              error: null,
            }
          },
        });
      }
      console.log(`Error, ${result}`);
      return dispatch({
        type: 'UPDATE_ARTICLES',
        data: {
          data: getState().articles.data,
          state: {
            refreshing: false,
            loading: false,
            success: false,
            error: 'server'
          }
        }
      });
    }).catch((err) => {
      return dispatch({
        type: 'UPDATE_ARTICLES',
        data: {
          data: getState().articles.data,
          state: {
            refreshing: false,
            loading: false,
            success: false,
            error: err,
          }
        }
      });
    })
  };
}

/**
 * @docs actionCreators
 * Créateur d'action pour clearArticles
 * @returns Action
 */
function clearArticlesCreator() {
  return {
    type: 'CLEAR_DATABASE'
  }
}

/**
 * Récupère les infos basiques articles depuis le serveur
 * @param lastId L'id du dernier article, par ordre chronologique, de la liste d'articles/database redux
 */
function updateArticles() {
  console.log("Update articles")
  return Store.dispatch(updateArticlesCreator());
}

/**
 * Récupère toutes les infos publiques d'un seul article
 * @param articleId L'id de l'article à récuperer
 */
function fetchArticle(articleId) {
  console.log(`Fetch article ${articleId}`)
  return Store.dispatch(fetchArticleCreator(articleId));
}

/**
 * Vide la database redux complètement
 */
function clearArticles() {
  console.log("Clear articles")
  return Store.dispatch(clearArticlesCreator());
}

export { updateArticles, clearArticles, fetchArticle };
