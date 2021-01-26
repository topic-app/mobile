import Store from '@redux/store';
import { AppThunk, UPDATE_ARTICLES_STATE, ArticleCreationData } from '@ts/redux';
import { request } from '@utils/index';

import {
  reportCreator,
  approveCreator,
  deleteCreator,
  likeCreator,
  deverifyCreator,
} from './ActionCreator';

function articleAddCreator({
  title,
  date,
  location,
  group,
  image,
  summary,
  parser,
  data,
  preferences,
  tags,
}: ArticleCreationData): AppThunk<Promise<{ _id: string }>> {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: UPDATE_ARTICLES_STATE,
        data: {
          add: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });
      request(
        'articles/add',
        'post',
        {
          article: {
            title,
            date,
            location,
            author: getState().account.accountInfo?.accountId,
            group,
            image,
            summary,
            tags,
            content: {
              parser,
              data,
            },
            preferences,
          },
        },
        true,
      )
        .then((result) => {
          dispatch({
            type: UPDATE_ARTICLES_STATE,
            data: {
              add: {
                loading: false,
                success: true,
                error: null,
              },
            },
          });
          resolve(result.data as { _id: string });
        })
        .catch((error) => {
          dispatch({
            type: UPDATE_ARTICLES_STATE,
            data: {
              add: {
                loading: false,
                success: false,
                error,
              },
            },
          });
          reject();
        });
    });
  };
}

async function articleAdd(data: ArticleCreationData) {
  return Store.dispatch(articleAddCreator(data));
}

async function articleVerificationApprove(id: string) {
  await Store.dispatch(
    approveCreator({
      url: 'articles/verification/approve',
      stateUpdate: UPDATE_ARTICLES_STATE,
      paramName: 'articleId',
      id,
    }),
  );
}

async function articleReport(articleId: string, reason: string) {
  await Store.dispatch(
    reportCreator({
      contentId: articleId,
      contentIdName: 'articleId',
      url: 'articles/report',
      stateUpdate: UPDATE_ARTICLES_STATE,
      reason,
    }),
  );
}

async function articleDelete(id: string) {
  await Store.dispatch(
    deleteCreator({
      id,
      paramName: 'articleId',
      url: 'articles/delete',
      stateUpdate: UPDATE_ARTICLES_STATE,
    }),
  );
}

async function articleDeverify(id: string) {
  await Store.dispatch(
    deverifyCreator({
      contentId: id,
      contentIdName: 'articleId',
      url: 'articles/verification/deverify',
      stateUpdate: UPDATE_ARTICLES_STATE,
    }),
  );
}

async function articleLike(contentId: string, liking: boolean = true) {
  await Store.dispatch(likeCreator({ contentId, liking, stateUpdate: UPDATE_ARTICLES_STATE }));
}

export {
  articleAdd,
  articleReport,
  articleVerificationApprove,
  articleDelete,
  articleLike,
  articleDeverify,
};
