import Store from '@redux/store';
import { request } from '@utils/index';
import { reportCreator } from './ActionCreator';
import { UPDATE_COMMENTS_STATE } from '@ts/types';

function commentAddCreator({ publisher, content, parent, parentType }) {
  return (dispatch, getState) => {
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
          .then((result) => {
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
          .then((result) => {
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
            console.log('Added');
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

async function commentAdd(publisher, content, parent, parentType) {
  await Store.dispatch(
    commentAddCreator({
      publisher,
      content,
      parent,
      parentType,
    }),
  );
}

async function commentReport(commentId, reason) {
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
