import Store from '@redux/store';
import { request } from '@utils/index';
import { UPDATE_USERS_STATE } from '@ts/types';
import { reportCreator } from './ActionCreator';

function userFollowCreator({ id }: { id: string }) {
  return (dispatch: (action: { type: string; data: any }) => void) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'UPDATE_USERS_STATE',
        data: {
          follow: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });
      request(
        'profile/follow',
        'post',
        {
          type: 'user',
          id,
        },
        true,
      )
        .then(() => {
          dispatch({
            type: 'UPDATE_USERS_STATE',
            data: {
              follow: {
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
            type: 'UPDATE_USERS_STATE',
            data: {
              follow: {
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

function userUnfollowCreator({ id }: { id: string }) {
  return (dispatch: (action: { type: string; data: any }) => void) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'UPDATE_USERS_STATE',
        data: {
          follow: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });
      request(
        'profile/unfollow',
        'post',
        {
          id,
          type: 'user',
        },
        true,
      )
        .then(() => {
          dispatch({
            type: 'UPDATE_USERS_STATE',
            data: {
              follow: {
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
            type: 'UPDATE_USERS_STATE',
            data: {
              follow: {
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
