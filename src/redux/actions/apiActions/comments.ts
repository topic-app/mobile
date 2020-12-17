import Store from '@redux/store';
import { UPDATE_COMMENTS_STATE, Publisher, Content, AppThunk, Comment } from '@ts/types';
import { request } from '@utils/index';

import { reportCreator } from './ActionCreator';

type CommentAddCreatorParams = {
  publisher: { type: 'user' | 'group'; user?: string | null; group?: string | null };
  content: Content;
  parent: string;
  parentType: Comment['parentType'];
};

function commentAddCreator({
  publisher,
  content,
  parent,
  parentType,
}: CommentAddCreatorParams): AppThunk {
  return (dispatch) => {
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
            resolve({ parent, _id: result.data?._id });
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
            resolve({ parent, _id: result.data?._id });
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
  publisher: { type: 'user' | 'group'; user?: string | null; group?: string | null },
  content: Content,
  parent: string,
  parentType: Comment['parentType'],
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
