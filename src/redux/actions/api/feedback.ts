import Store from '@redux/store';
import { AppThunk, UPDATE_LINKING_STATE } from '@ts/redux';
import { request } from '@utils';

function sendFeedbackCreator(data: Record<string, any>): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_LINKING_STATE,
      data: {
        feedback: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });

    try {
      await request('beta/feedback', 'post', { ...data }, true);
    } catch (error) {
      dispatch({
        type: UPDATE_LINKING_STATE,
        data: {
          feedback: {
            loading: false,
            success: false,
            error,
          },
        },
      });
      throw error;
    }

    dispatch({
      type: UPDATE_LINKING_STATE,
      data: {
        feedback: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    return true;
  };
}

async function sendFeedback(data: Record<string, any>) {
  await Store.dispatch(sendFeedbackCreator(data));
}

export { sendFeedback };
