import Store from '@redux/store';

import { clearCreator, fetchCreator, updateCreator } from './ActionCreator';

const dateDescSort = (data) => data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

/**
 * @docs actions
 * Récupère les infos basiques articles depuis le serveur
 * @param type [initial, next, refresh] le type de récupération. Si c'est next, il récupère automatiquement les articles après le dernier contenu dans redux
 * @param params Les paramètres supplémentaires pour la requete (eg. tags, auteurs)
 */
function updateArticles(type, params) {
  return Store.dispatch(
    updateCreator({
      update: 'UPDATE_ARTICLES',
      stateUpdate: 'UPDATE_ARTICLES_STATE',
      url: 'articles/list',
      sort: dateDescSort,
      dataType: 'articles',
      type,
      params,
    }),
  );
}

/**
 * @docs actions
 * Récupère les infos basiques articles depuis le serveur en recherchant 'terms'
 * @param type [initial, next, refresh] le type de récupération. Si c'est next, il récupère automatiquement les articles après le dernier contenu dans redux
 * @param terms Le texte pour rechercher
 * @param params Les paramètres supplémentaires pour la requete (eg. tags, auteurs)
 */
function searchArticles(type, terms, params) {
  if (type !== 'next') Store.dispatch(clearCreator({ clear: 'CLEAR_ARTICLES', data: false }));
  return Store.dispatch(
    updateCreator({
      update: 'UPDATE_ARTICLES_SEARCH',
      stateUpdate: 'UPDATE_ARTICLES_STATE',
      url: 'articles/list',
      dataType: 'articles',
      type,
      params: { ...params, search: true, terms },
      stateName: 'search',
    }),
  );
}

/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul article
 * @param articleId L'id de l'article à récuperer
 */
function fetchArticle(articleId) {
  return Store.dispatch(
    fetchCreator({
      update: 'UPDATE_ARTICLES',
      stateUpdate: 'UPDATE_ARTICLES_STATE',
      url: 'articles/info',
      dataType: 'articles',
      sort: dateDescSort,
      params: { articleId },
    }),
  );
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearArticles() {
  return Store.dispatch(clearCreator({ clear: 'CLEAR_ARTICLES' }));
}

export { updateArticles, clearArticles, fetchArticle, searchArticles };
