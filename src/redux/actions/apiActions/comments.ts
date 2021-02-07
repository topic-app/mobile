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
  return async (dispatch) => {
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
    let result;
    try {
      result = await request(
        publisher.type === 'group' ? 'comments/add/group' : 'comments/add/user',
        'post',
        publisher.type === 'group'
          ? {
              parentId: parent,
              parentType,
              group: publisher.group,
              comment: {
                content,
              },
            }
          : {
              parentId: parent,
              parentType,
              comment: {
                content,
              },
            },
        true,
      );
    } catch (error) {
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
      throw error;
    }
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
    return { parent, _id: result.data?._id };
  };
}

type CommentDeleteCreatorParams = {
  commentId: string;
  publisher: Publisher;
};

function commentDeleteCreator({ commentId, publisher }: CommentDeleteCreatorParams): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_COMMENTS_STATE,
      data: {
        delete: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    let result;
    try {
      result = await request(
        `comments/delete/${publisher.type}`,
        'post',
        {
          commentId,
        },
        true,
      );
    } catch (error) {
      dispatch({
        type: UPDATE_COMMENTS_STATE,
        data: {
          delete: {
            loading: false,
            success: false,
            error,
          },
        },
      });
      throw error;
    }
    dispatch({
      type: UPDATE_COMMENTS_STATE,
      data: {
        delete: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    return { _id: result.data?._id };
  };
}

async function commentDelete(commentId: string, publisher: Publisher) {
  await Store.dispatch(
    commentDeleteCreator({
      commentId,
      publisher,
    }),
  );
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

export { commentAdd, commentReport, commentDelete };
