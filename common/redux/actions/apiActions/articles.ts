import Store from '@redux/store';
import { request } from '@utils/index';
import { reportCreator } from './ActionCreator';
import { UPDATE_ARTICLES_STATE } from '@ts/redux';

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
}) {
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
            author: getState().account.accountInfo.accountId,
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
          resolve(result.data);
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

async function articleAdd(
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
) {
  await Store.dispatch(
    articleAddCreator({
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
    }),
  );
}

async function articleReport(articleId, reason) {
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

export { articleAdd, articleReport };
