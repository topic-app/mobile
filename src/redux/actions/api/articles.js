import request from '@utils/request';
import Store from '@redux/store';

/**
 * @docs actionCreators
 * Créateur d'action pour updateArticles
 * @param next Si il faut récupérer les articles après le dernier
 * @returns Action
 */
function updateArticlesCreator(type = 'initial', params = {}) {
  return (dispatch, getState) => {
    let lastId;
    let number = 10;
    dispatch({
      type: 'UPDATE_ARTICLES_STATE',
      data: {
        list: {
          loading: {
            initial: type === 'initial',
            refresh: type === 'refresh',
            next: type === 'next',
          },
          success: null,
          error: null,
        },
      },
    });
    if (type === 'next') {
      const articles = getState().articles.data;
      // articles.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
      lastId = articles[articles.length - 1]._id;
      number = 5;
    }
    request('articles/list', 'get', { lastId, number, ...params })
      .then((result) => {
        const { data } = getState().articles; // The old articles, in redux db
        result.data.articles.forEach((a) => {
          const article = { ...a, preload: true };
          if (data.some((p) => p._id === a._id)) {
            data[data.map((p) => p._id).indexOf(a._id)] = article;
          } else {
            data.push(article);
          }
        });
        data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
        dispatch({
          type: 'UPDATE_ARTICLES',
          data,
        });
        return dispatch({
          type: 'UPDATE_ARTICLES_STATE',
          data: {
            list: {
              loading: {
                initial: false,
                refresh: false,
                next: false,
              },
              success: true,
              error: null,
            },
          },
        });
      })
      .catch((error) => {
        return dispatch({
          type: 'UPDATE_ARTICLES_STATE',
          data: {
            list: {
              loading: {
                initial: false,
                refresh: false,
                next: false,
              },
              success: false,
              error,
            },
          },
        });
      });
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
      type: 'UPDATE_ARTICLES_STATE',
      data: {
        info: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    request('articles/info', 'get', { articleId })
      .then((result) => {
        const { articles } = result.data;
        const article = articles[0];
        const { data } = getState().articles; // The old articles, in redux db
        if (data.some((p) => p._id === article._id)) {
          data[data.map((p) => p._id).indexOf(article._id)] = article;
        } else {
          data.push(article);
        }
        data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
        dispatch({
          type: 'UPDATE_ARTICLES',
          data,
        });
        return dispatch({
          type: 'UPDATE_ARTICLES_STATE',
          data: {
            info: {
              loading: false,
              success: true,
              error: null,
            },
          },
        });
      })
      .catch((err) => {
        return dispatch({
          type: 'UPDATE_ARTICLES_STATE',
          data: {
            info: {
              loading: false,
              success: false,
              error: err,
            },
          },
        });
      });
  };
}

/**
 * @docs actionCreators
 * Créateur d'action pour clearArticles
 * @returns Action
 */
function clearArticlesCreator() {
  return {
    type: 'CLEAR_ARTICLES',
  };
}

/**
 * @docs actions
 * Récupère les infos basiques articles depuis le serveur
 * @param next Si il faut récupérer les articles après le dernier
 */
function updateArticles(type, params) {
  return Store.dispatch(updateArticlesCreator(type, params));
}

/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul article
 * @param articleId L'id de l'article à récuperer
 */
function fetchArticle(articleId) {
  return Store.dispatch(fetchArticleCreator(articleId));
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearArticles() {
  return Store.dispatch(clearArticlesCreator());
}

export { updateArticles, clearArticles, fetchArticle };
