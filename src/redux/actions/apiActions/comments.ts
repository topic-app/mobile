import Store from '@redux/store';
import { request } from '@utils/index';
import { reportCreator } from './ActionCreator';
import { UPDATE_COMMENTS_STATE, Publisher, Content } from '@ts/types';

type commentAddProps = {
  publisher: Publisher;
  content: Content;
  parent: string;
  parentType: string;
};

function commentAddCreator({ publisher, content, parent, parentType }: commentAddProps) {
  return (dispatch: (action: any) => void) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: UPDATE_COMMENTS_STATE,
        data: {
          add: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });
      if (publisher.type === 'group') {
        request(
          'comments/add/group',
          'post',
          {
            parentId: parent,
            parentType,
            group: publisher.group,
            comment: {
              content,
            },
          },
          true,
        )
          .then(() => {
            dispatch({
              type: UPDATE_COMMENTS_STATE,
              data: {
                add: {
                  loading: false,
                  success: true,
                  error: null,
                },
              },
            });
            resolve();
          })
          .catch((error) => {
            dispatch({
              type: UPDATE_COMMENTS_STATE,
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
      } else {
        request(
          'comments/add/user',
          'post',
          {
            parentId: parent,
            parentType,
            comment: {
              content,
            },
          },
          true,
        )
          .then(() => {
            dispatch({
              type: UPDATE_COMMENTS_STATE,
              data: {
                add: {
                  loading: false,
                  success: true,
                  error: null,
                },
              },
            });
            resolve();
          })
          .catch((error) => {
            dispatch({
              type: UPDATE_COMMENTS_STATE,
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
      }
    });
  };
}

async function commentAdd(
  publisher: Publisher,
  content: Content,
  parent: string,
  parentType: string,
) {
  await Store.dispatch(
    commentAddCreator({
      publisher,
      content,
      parent,
      parentType,
    }),
  );
}

async function commentReport(commentId: string, reason: string) {
  await Store.dispatch(
    reportCreator({
      stateUpdate: UPDATE_COMMENTS_STATE,
      url: 'comments/report',
      reason,
      contentId: commentId,
      contentIdName: 'commentId',
    }),
  );
}

export { commentAdd, commentReport };
