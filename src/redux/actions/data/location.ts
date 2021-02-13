import { AnyAction } from 'redux';

import Store from '@redux/store';
import {
  LocationRequestState,
  School,
  Department,
  UPDATE_LOCATION_STATE,
  UPDATE_LOCATION,
  CLEAR_LOCATION,
  AppThunk,
  LocationState,
} from '@ts/types';
import { request } from '@utils/index';

/**
 * @docs actionCreators
 * Ajoute des paramètres aux données de création de compte
 * @param lastId L'id du dernier article, par ordre chronologique, de la liste d'articles/database redux
 * @returns Action
 */
function updateLocationCreator(fields: Partial<LocationState>): AppThunk {
  return async (dispatch, getState) => {
    dispatch({
      type: UPDATE_LOCATION,
      data: fields,
    });
    if (!getState().account.loggedIn) {
      return;
    }
    dispatch({
      type: UPDATE_LOCATION_STATE,
      data: {
        update: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });

    try {
      await request('profile/modify/data', 'post', { data: { location: fields } }, true);
    } catch (error) {
      dispatch({
        type: UPDATE_LOCATION_STATE,
        data: {
          update: {
            loading: false,
            success: false,
            error,
          },
        },
      });
      throw error;
    }

    dispatch({
      type: UPDATE_LOCATION_STATE,
      data: {
        update: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    return true;
  };
}

function clearLocationCreator(): AnyAction {
  return {
    type: CLEAR_LOCATION,
    data: {},
  };
}

function updateStateCreator(state: Partial<LocationRequestState>): AnyAction {
  return {
    type: UPDATE_LOCATION_STATE,
    data: state,
  };
}

function fetchLocationDataCreator(): AppThunk {
  return async (dispatch, getState) => {
    dispatch({
      type: UPDATE_LOCATION_STATE,
      data: {
        fetch: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });

    const { schools, departments } = getState().location;
    const schoolData: School[] = [];
    const departmentData: Department[] = [];
    let error = false;

    await Promise.all(
      schools.map(async (school) => {
        try {
          const result = await request('schools/info', 'get', { schoolId: school });
          schoolData.push(result?.data?.schools[0]);
        } catch (e) {
          error = e;
        }
      }),
    );

    await Promise.all(
      departments.map(async (department) => {
        try {
          const result = await request('departments/info', 'get', { departmentId: department });
          departmentData.push(result?.data?.departments[0]);
        } catch (e) {
          error = e;
        }
      }),
    );

    if (error) {
      dispatch({
        type: UPDATE_LOCATION_STATE,
        data: {
          fetch: {
            loading: false,
            success: false,
            error,
          },
        },
      });
      throw error;
    }

    dispatch({
      type: UPDATE_LOCATION_STATE,
      data: {
        fetch: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    dispatch({
      type: UPDATE_LOCATION,
      data: {
        schoolData,
        departmentData,
      },
    });
    return true;
  };
}

async function fetchLocationData() {
  await Store.dispatch(fetchLocationDataCreator());
}

async function updateLocation(fields: Partial<LocationState>, fetch: boolean = true) {
  await Store.dispatch(updateLocationCreator(fields));
  if (fetch) fetchLocationData();
}

function updateState(fields: Partial<LocationRequestState>) {
  Store.dispatch(updateStateCreator(fields));
}

function clearLocation() {
  Store.dispatch(clearLocationCreator());
}

export { updateLocation, fetchLocationData, updateState, clearLocation };
