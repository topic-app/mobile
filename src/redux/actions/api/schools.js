import request from '@utils/request';
import Store from '@redux/store';

/**
 * @docs actionCreators
 * Créateur d'action pour updateSchools
 * @param next Si il faut récupérer les schools après le dernier
 * @returns Action
 */
function updateSchoolsCreator(type = 'initial', params = {}) {
  return (dispatch, getState) => {
    let lastId;
    let number = 10;
    dispatch({
      type: 'UPDATE_SCHOOLS_STATE',
      data: {
        loading: {
          initial: type === 'initial',
          refresh: type === 'refresh',
          next: type === 'next',
          school: getState().schools.state.loading.school,
        },
        success: null,
        error: null,
      },
    });
    if (type === 'next') {
      const schools = getState().schools.data;
      // schools.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
      lastId = schools[schools.length - 1]._id;
      number = 5;
    }
    request('schools/list', 'get', { lastId, number, ...params })
      .then((result) => {
        console.log(`Result ${JSON.stringify(result)}`);
        if (result.success) {
          const { data } = getState().schools; // The old schools, in redux db
          result.data.schools.forEach((a) => {
            const school = { ...a, preload: true };
            if (data.some((p) => p._id === a._id)) {
              data[data.map((p) => p._id).indexOf(a._id)] = school;
            } else {
              data.push(school);
            }
          });
          data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
          dispatch({
            type: 'UPDATE_SCHOOLS',
            data,
          });
          return dispatch({
            type: 'UPDATE_SCHOOLS_STATE',
            data: {
              loading: {
                initial: false,
                refresh: false,
                next: false,
                school: getState().schools.state.loading.school,
              },
              success: true,
              error: null,
            },
          });
        }
        console.log(`Error, ${result}`);
        return dispatch({
          type: 'UPDATE_SCHOOLS_STATE',
          data: {
            loading: {
              initial: false,
              refresh: false,
              next: false,
              school: getState().schools.state.loading.school,
            },
            success: false,
            error: 'server',
          },
        });
      })
      .catch((err) => {
        return dispatch({
          type: 'UPDATE_SCHOOLS_STATE',
          data: {
            loading: {
              initial: false,
              refresh: false,
              next: false,
              school: getState().schools.state.loading.school,
            },
            success: false,
            error: err,
          },
        });
      });
  };
}

/**
 * @docs actionCreators
 * Créateur d'action pour fetchSchool
 * @param schoolId L'id de l'school que l'on veut chercher
 * @returns Action
 */
function fetchSchoolCreator(schoolId) {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_SCHOOLS_STATE',
      data: {
        loading: {
          initial: getState().schools.state.loading.initial,
          refresh: getState().schools.state.loading.refresh,
          next: getState().schools.state.loading.next,
          school: true,
        },
        success: null,
        error: null,
      },
    });
    request('schools/info', 'get', { schoolId })
      .then((result) => {
        const { schools } = result.data;
        const school = schools[0];
        const { data } = getState().schools; // The old schools, in redux db
        if (data.some((p) => p._id === school._id)) {
          data[data.map((p) => p._id).indexOf(school._id)] = school;
        } else {
          data.push(school);
        }
        data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
        if (result.success) {
          dispatch({
            type: 'UPDATE_SCHOOLS',
            data,
          });
          return dispatch({
            type: 'UPDATE_SCHOOLS_STATE',
            data: {
              loading: {
                initial: getState().schools.state.loading.initial,
                refresh: getState().schools.state.loading.refresh,
                next: getState().schools.state.loading.next,
                school: false,
              },
              success: true,
              error: null,
            },
          });
        }
        console.log(`ERROR: ${result}`);
        return dispatch({
          type: 'UPDATE_SCHOOLS_STATE',
          data: {
            loading: {
              initial: getState().schools.state.loading.initial,
              refresh: getState().schools.state.loading.refresh,
              next: getState().schools.state.loading.next,
              school: false,
            },
            success: false,
            error: 'server',
          },
        });
      })
      .catch((err) => {
        console.log(`ERROR: ${err}`);
        return dispatch({
          type: 'UPDATE_SCHOOLS_STATE',
          data: {
            loading: {
              initial: getState().schools.state.loading.initial,
              refresh: getState().schools.state.loading.refresh,
              next: getState().schools.state.loading.next,
              school: false,
            },
            success: false,
            error: err,
          },
        });
      });
  };
}

/**
 * @docs actionCreators
 * Créateur d'action pour clearSchools
 * @returns Action
 */
function clearSchoolsCreator() {
  return {
    type: 'CLEAR_SCHOOLS',
  };
}

/**
 * @docs actions
 * Récupère les infos basiques schools depuis le serveur
 * @param next Si il faut récupérer les schools après le dernier
 */
function updateSchools(type, params) {
  console.log(`Update schools`);
  return Store.dispatch(updateSchoolsCreator(type, params));
}

/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul school
 * @param schoolId L'id de l'school à récuperer
 */
function fetchSchool(schoolId) {
  return Store.dispatch(fetchSchoolCreator(schoolId));
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearSchools() {
  return Store.dispatch(clearSchoolsCreator());
}

export { updateSchools, clearSchools, fetchSchool };
