import Store from '@redux/store';
import {
  UPDATE_ARTICLES_DATA,
  UPDATE_ARTICLES_SEARCH,
  UPDATE_ARTICLES_ITEM,
  UPDATE_ARTICLES_STATE,
  CLEAR_ARTICLES,
} from '@ts/redux';
import { Item, UPDATE_ARTICLES_VERIFICATION } from '@ts/types';

import { clearCreator, fetchCreator, updateCreator } from './ActionCreator';

const dateDescSort = (data: Item[]) =>
  data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

/**
 * @docs actions
 * Récupère les infos basiques articles depuis le serveur
 * @param type [initial, next, refresh] le type de récupération. Si c'est next, il récupère automatiquement les articles après le dernier contenu dans redux
 * @param params Les paramètres supplémentaires pour la requete (eg. tags, auteurs)
 */
async function updateArticles(
  type: 'initial' | 'refresh' | 'next',
  params = {},
  useDefaultParams = true,
) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_ARTICLES_DATA,
      stateUpdate: UPDATE_ARTICLES_STATE,
      url: 'articles/list',
      sort: dateDescSort,
      dataType: 'articles',
      type,
      params: useDefaultParams ? { ...Store.getState().articleData.params, ...params } : params,
    }),
  );
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
async function clearArticles(data = true, search = true, verification = true) {
  await Store.dispatch(clearCreator({ clear: CLEAR_ARTICLES, data, search, verification }));
}

/**
 * @docs actions
 * Récupère les infos basiques articles depuis le serveur en recherchant 'terms'
 * @param type [initial, next, refresh] le type de récupération. Si c'est next, il récupère automatiquement les articles après le dernier contenu dans redux
 * @param terms Le texte pour rechercher
 * @param params Les paramètres supplémentaires pour la requete (eg. tags, auteurs)
 */
async function searchArticles(
  type: 'initial' | 'refresh' | 'next',
  terms: string,
  params = {},
  search = true,
  useDefaultParams = false,
) {
  console.log(`Search articles ${JSON.stringify(params)}`);
  await Store.dispatch(
    updateCreator({
      update: UPDATE_ARTICLES_SEARCH,
      stateUpdate: UPDATE_ARTICLES_STATE,
      url: 'articles/list',
      dataType: 'articles',
      type,
      params: useDefaultParams
        ? { ...Store.getState().articleData.params, ...params, search, terms }
        : { ...params, search, terms },
      stateName: 'search',
      listName: 'search',
      clear: type !== 'next',
    }),
  );
}

/**
 * @docs actions
 * Récupère les infos sur les articles a verifier
 * @param type [initial, next, refresh] le type de récupération. Si c'est next, il récupère automatiquement les articles après le dernier contenu dans redux
 * @param terms Le texte pour rechercher
 * @param params Les paramètres supplémentaires pour la requete (eg. tags, auteurs)
 */
async function updateArticlesVerification(type: 'initial' | 'refresh' | 'next', params = {}) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_ARTICLES_VERIFICATION,
      stateUpdate: UPDATE_ARTICLES_STATE,
      url: 'articles/verification/list',
      dataType: 'articles',
      type,
      params,
      stateName: 'verification_list',
      listName: 'verification',
      clear: type !== 'next',
      auth: true,
    }),
  );
}

/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul article
 * @param articleId L'id de l'article à récuperer
 */
async function fetchArticle(articleId: string) {
  await Store.dispatch(
    fetchCreator({
      update: UPDATE_ARTICLES_ITEM,
      stateUpdate: UPDATE_ARTICLES_STATE,
      url: 'articles/info',
      dataType: 'articles',
      params: { articleId },
    }),
  );
}

export { updateArticles, clearArticles, fetchArticle, searchArticles, updateArticlesVerification };
