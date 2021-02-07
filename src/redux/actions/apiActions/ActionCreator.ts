import { ApiAction, AppThunk } from '@ts/redux';
import { request } from '@utils/index';

type ReportCreatorParams = {
  contentId: string;
  contentIdName: string;
  reason: string;
  url: string;
  stateUpdate: ApiAction.UpdateStateType;
};

function reportCreator({
  contentId,
  contentIdName,
  reason,
  url,
  stateUpdate,
}: ReportCreatorParams): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: stateUpdate,
      data: {
        report: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    let result;
    try {
      result = await request(
        url,
        'post',
        {
          [contentIdName]: contentId,
          reason,
        },
        true,
      );
    } catch (error) {
      dispatch({
        type: stateUpdate,
        data: {
          report: {
            loading: false,
            success: false,
            error,
          },
        },
      });
      throw error;
    }
    dispatch({
      type: stateUpdate,
      data: {
        report: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    return result.data;
  };
}

type ApproveCreatorParams = {
  url: string;
  id: string;
  paramName: string;
  stateUpdate: ApiAction.UpdateStateType;
};

function approveCreator({ url, stateUpdate, id, paramName }: ApproveCreatorParams): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: stateUpdate,
      data: {
        verification_approve: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    let result;
    try {
      result = await request(
        url,
        'post',
        {
          [paramName]: id,
        },
        true,
      );
    } catch (error) {
      dispatch({
        type: stateUpdate,
        data: {
          verification_approve: {
            loading: false,
            success: false,
            error,
          },
        },
      });
      throw error;
    }
    dispatch({
      type: stateUpdate,
      data: {
        verification_approve: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    return result.data;
  };
}

type deleteCreatorParams = {
  url: string;
  id: string;
  paramName: string;
  stateUpdate: ApiAction.UpdateStateType;
};

function deleteCreator({ url, stateUpdate, id, paramName }: deleteCreatorParams): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: stateUpdate,
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
        url,
        'post',
        {
          [paramName]: id,
        },
        true,
      );
    } catch (error) {
      dispatch({
        type: stateUpdate,
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
      type: stateUpdate,
      data: {
        delete: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    return result.data;
  };
}

type likeCreatorParams = {
  contentId: string;
  liking: boolean;
  stateUpdate: ApiAction.UpdateStateType;
};

function likeCreator({ contentId, liking, stateUpdate }: likeCreatorParams): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: stateUpdate,
      data: {
        like: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    let result;
    try {
      result = await request(
        `likes/${liking ? 'like' : 'unlike'}`,
        'post',
        {
          contentId,
        },
        true,
      );
    } catch (error) {
      dispatch({
        type: stateUpdate,
        data: {
          like: {
            loading: false,
            success: false,
            error,
          },
        },
      });
      throw error;
    }
    dispatch({
      type: stateUpdate,
      data: {
        like: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    return result.data;
  };
}

type deverifyCreatorParams = {
  contentId: string;
  contentIdName: string;
  stateUpdate: ApiAction.UpdateStateType;
  url: string;
};

function deverifyCreator({
  contentId,
  contentIdName,
  stateUpdate,
  url,
}: deverifyCreatorParams): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: stateUpdate,
      data: {
        verification_deverify: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    let result;
    try {
      result = await request(
        url,
        'post',
        {
          [contentIdName]: contentId,
        },
        true,
      );
    } catch (error) {
      dispatch({
        type: stateUpdate,
        data: {
          verification_deverify: {
            loading: false,
            success: false,
            error,
          },
        },
      });
      throw error;
    }
    dispatch({
      type: stateUpdate,
      data: {
        verification_deverify: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    return result.data;
  };
}

export { reportCreator, approveCreator, deleteCreator, likeCreator, deverifyCreator };
