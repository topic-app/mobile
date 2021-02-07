import Store from '@redux/store';
import { AppThunk, UPDATE_USERS_STATE } from '@ts/types';
import { request } from '@utils/index';

import { reportCreator } from './ActionCreator';

function userFollowCreator({ id }: { id: string }): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_USERS_STATE,
      data: {
        follow: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    let result;
    try {
      result = await request(
        'profile/follow',
        'post',
        {
          type: 'user',
          id,
        },
        true,
      );
    } catch (error) {
      dispatch({
        type: UPDATE_USERS_STATE,
        data: {
          follow: {
            loading: false,
            success: false,
            error,
          },
        },
      });
      throw error;
    }
    dispatch({
      type: UPDATE_USERS_STATE,
      data: {
        follow: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    return { type: 'user', id };
  };
}

function userUnfollowCreator({ id }: { id: string }): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_USERS_STATE,
      data: {
        follow: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    let result;
    try {
      result = await request(
        'profile/unfollow',
        'post',
        {
          id,
          type: 'user',
        },
        true,
      );
    } catch (error) {
      dispatch({
        type: UPDATE_USERS_STATE,
        data: {
          follow: {
            loading: false,
            success: false,
            error,
          },
        },
      });
      throw error;
    }
    dispatch({
      type: UPDATE_USERS_STATE,
      data: {
        follow: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    return { type: 'user', id };
  };
}

async function userFollow(id: string) {
  await Store.dispatch(
    userFollowCreator({
      id,
    }),
  );
}

async function userUnfollow(id: string) {
  await Store.dispatch(
    userUnfollowCreator({
      id,
    }),
  );
}

async function userReport(userId: string, reason: string) {
  await Store.dispatch(
    reportCreator({
      contentId: userId,
      contentIdName: 'userId',
      url: 'users/report',
      stateUpdate: UPDATE_USERS_STATE,
      reason,
    }),
  );
}

export { userFollow, userUnfollow, userReport };
