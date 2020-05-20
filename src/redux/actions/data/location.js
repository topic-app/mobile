import request from '@utils/request';
import Store from '@redux/store';

/**
 * @docs actionCreators
 * Ajoute des paramètres aux données de création de compte
 * @param lastId L'id du dernier article, par ordre chronologique, de la liste d'articles/database redux
 * @returns Action
 */
function updateLocationCreator(fields) {
  return {
    type: 'UPDATE_LOCATION',
    data: fields,
  };
}

function clearLocationCreator() {
  return {
    type: 'CLEAR_LOCATION',
    data: {},
  };
}

function updateStateCreator(state) {
  return {
    type: 'UPDATE_LOCATION_STATE',
    data: state,
  };
}

function fetchLocationDataCreator() {
  return async (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_LOCATION_STATE',
      data: {
        loading: true,
        success: null,
        error: null,
      },
    });

    const { schools, departments } = getState().location;
    const schoolData = [];
    const departmentData = [];
    let error = false;

    await Promise.all(
      schools.map(async (school) => {
        try {
          const result = await request('/schools/info', 'get', { schoolId: school });
          if (result.success) {
            schoolData.push(result?.data?.schools[0]);
          } else {
            error = true;
          }
        } catch (e) {
          error = true;
          console.log('Error while getting school info', JSON.stringify(e));
        }
      }),
    );

    await Promise.all(
      departments.map(async (department) => {
        try {
          const result = await request('/departments/info', 'get', { departmentId: department });
          if (result.success) {
            departmentData.push(result?.data?.departments[0]);
          } else {
            error = true;
          }
        } catch (e) {
          error = true;
          console.log('Error while getting department info', JSON.stringify(e));
        }
      }),
    );

    if (error) {
      return dispatch({
        type: 'UPDATE_LOCATION_STATE',
        data: {
          loading: false,
          success: false,
          error: 'server',
        },
      });
    }

    dispatch({
      type: 'UPDATE_LOCATION_STATE',
      data: {
        loading: false,
        success: true,
        error: null,
      },
    });
    return dispatch({
      type: 'UPDATE_LOCATION',
      data: {
        schoolData,
        departmentData,
      },
    });
  };
}

function fetchLocationData() {
  return Store.dispatch(fetchLocationDataCreator());
}

function updateLocation(fields, fetch = true) {
  Store.dispatch(updateLocationCreator(fields));
  if (fetch) fetchLocationData();
}

function updateState(fields) {
  return Store.dispatch(updateStateCreator(fields));
}

function clearLocation(fields) {
  return Store.dispatch(clearLocationCreator(fields));
}

export { updateLocation, fetchLocationData, updateState, clearLocation };
