import { request } from '@utils/index';
import Store from '@redux/store';

/**
 * @docs actionCreators
 * Ajoute des paramètres aux données de création de compte
 * @param lastId L'id du dernier article, par ordre chronologique, de la liste d'articles/database redux
 * @returns Action
 */
function updateLocationCreator(fields) {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      dispatch({
        type: 'UPDATE_LOCATION',
        data: fields,
      });
      if (!getState().account.loggedIn) {
        resolve();
        return;
      }
      dispatch({
        type: 'UPDATE_LOCATION_STATE',
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
          type: 'UPDATE_LOCATION_STATE',
          data: {
            update: {
              loading: false,
              success: false,
              error,
            },
          },
        });
        reject();
        return;
      }

      dispatch({
        type: 'UPDATE_LOCATION_STATE',
        data: {
          update: {
            loading: false,
            success: true,
            error: null,
          },
        },
      });
      resolve();
    });
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
    return new Promise(async (resolve, reject) => {
      dispatch({
        type: 'UPDATE_LOCATION_STATE',
        data: {
          fetch: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });

      const { schools, departments } = getState().location;
      const schoolData = [];
      const departmentData = [];
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
          type: 'UPDATE_LOCATION_STATE',
          data: {
            fetch: {
              loading: false,
              success: false,
              error,
            },
          },
        });
        reject();
        return;
      }

      dispatch({
        type: 'UPDATE_LOCATION_STATE',
        data: {
          fetch: {
            loading: false,
            success: true,
            error: null,
          },
        },
      });
      dispatch({
        type: 'UPDATE_LOCATION',
        data: {
          schoolData,
          departmentData,
        },
      });
      resolve();
    });
  };
}

async function fetchLocationData() {
  await Store.dispatch(fetchLocationDataCreator());
}

async function updateLocation(fields, fetch = true) {
  await Store.dispatch(updateLocationCreator(fields));
  if (fetch) fetchLocationData();
}

async function updateState(fields) {
  await Store.dispatch(updateStateCreator(fields));
}

async function clearLocation(fields) {
  await Store.dispatch(clearLocationCreator(fields));
}

export { updateLocation, fetchLocationData, updateState, clearLocation };
