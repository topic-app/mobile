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
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_LOCATION_STATE',
      data: {
        loading: true,
        success: null,
        error: null,
      },
    });
    const schoolData = [];
    const departmentData = [];
    getState().location.schools.forEach((school) => {
      request('/schools/info', 'get', { schoolId: school }).then((result) => {
        if (result.success) {
          console.log(`School result ${JSON.stringify(result)}`);
          return schoolData.push(result?.data?.schools[0]);
        }
        console.log(`Error, ${result}`);
        return dispatch({
          type: 'UPDATE_LOCATION_STATE',
          data: {
            loading: false,
            success: false,
            error: 'server',
          },
        });
      });
    });
    getState().location.departments.forEach((school) => {
      request('/departments/info', 'get', { schoolId: school }).then((result) => {
        if (result.success) {
          return departmentData.push(result?.data?.departments[0]);
        }
        console.log(`Error, ${result}`);
        return dispatch({
          type: 'UPDATE_LOCATION_STATE',
          data: {
            loading: false,
            success: false,
            error: 'server',
          },
        });
      });
    });
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
