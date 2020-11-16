import Store from '@redux/store';
import { request } from '@utils/index';
import { AppThunk, UPDATE_ARTICLES_STATE } from '@ts/redux';

import { reportCreator, approveCreator } from './ActionCreator';

type ArticleAddProps = {
  title: string;
  date: Date;
  location: {
    schools: string[];
    departments: string[];
    global: boolean;
  };
  group: string;
  image: {
    image: string;
    thumbnails: {
      small?: boolean;
      medium?: boolean;
      large?: boolean;
    };
  };
  summary: string;
  parser: 'markdown' | 'plaintext';
  data: string;
  preferences?: {
    comments?: boolean;
  };
  tags: string[];
};

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
}: ArticleAddProps): AppThunk {
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

function articleAdd(data: ArticleAddProps) {
  return Store.dispatch(articleAddCreator(data));
}

function articleVerificationApprove(id: string) {
  return Store.dispatch(
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

export { articleAdd, articleReport, articleVerificationApprove };
