import request from '@utils/request';
import Store from '@redux/store';

/**
 * @docs actionCreators
 * Créateur d'action pour updateDepartments
 * @param next Si il faut récupérer les departments après le dernier
 * @returns Action
 */
function updateDepartmentsCreator(type = 'initial', params = {}) {
  return (dispatch, getState) => {
    let lastId;
    let number = 10;
    dispatch({
      type: 'UPDATE_DEPARTMENTS_STATE',
      data: {
        loading: {
          initial: type === 'initial',
          refresh: type === 'refresh',
          next: type === 'next',
          department: getState().departments.state.loading.department,
        },
        success: null,
        error: null,
      },
    });
    if (type === 'next') {
      const departments = getState().departments.data;
      // departments.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
      lastId = departments[departments.length - 1]._id;
      number = 5;
    }
    request('departments/list', 'get', { lastId, number, ...params })
      .then((result) => {
        console.log(`Result ${JSON.stringify(result)}`);
        if (result.success) {
          const { data } = getState().departments; // The old departments, in redux db
          result.data.departments.forEach((a) => {
            const department = { ...a, preload: true };
            if (data.some((p) => p._id === a._id)) {
              data[data.map((p) => p._id).indexOf(a._id)] = department;
            } else {
              data.push(department);
            }
          });
          data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
          dispatch({
            type: 'UPDATE_DEPARTMENTS',
            data,
          });
          return dispatch({
            type: 'UPDATE_DEPARTMENTS_STATE',
            data: {
              loading: {
                initial: false,
                refresh: false,
                next: false,
                department: getState().departments.state.loading.department,
              },
              success: true,
              error: null,
            },
          });
        }
        console.log(`Error, ${result}`);
        return dispatch({
          type: 'UPDATE_DEPARTMENTS_STATE',
          data: {
            loading: {
              initial: false,
              refresh: false,
              next: false,
              department: getState().departments.state.loading.department,
            },
            success: false,
            error: 'server',
          },
        });
      })
      .catch((err) => {
        return dispatch({
          type: 'UPDATE_DEPARTMENTS_STATE',
          data: {
            loading: {
              initial: false,
              refresh: false,
              next: false,
              department: getState().departments.state.loading.department,
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
 * Créateur d'action pour fetchDepartment
 * @param departmentId L'id de l'department que l'on veut chercher
 * @returns Action
 */
function fetchDepartmentCreator(departmentId) {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_DEPARTMENTS_STATE',
      data: {
        loading: {
          initial: getState().departments.state.loading.initial,
          refresh: getState().departments.state.loading.refresh,
          next: getState().departments.state.loading.next,
          department: true,
        },
        success: null,
        error: null,
      },
    });
    request('departments/info', 'get', { departmentId })
      .then((result) => {
        const { departments } = result.data;
        const department = departments[0];
        const { data } = getState().departments; // The old departments, in redux db
        if (data.some((p) => p._id === department._id)) {
          data[data.map((p) => p._id).indexOf(department._id)] = department;
        } else {
          data.push(department);
        }
        data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
        if (result.success) {
          dispatch({
            type: 'UPDATE_DEPARTMENTS',
            data,
          });
          return dispatch({
            type: 'UPDATE_DEPARTMENTS_STATE',
            data: {
              loading: {
                initial: getState().departments.state.loading.initial,
                refresh: getState().departments.state.loading.refresh,
                next: getState().departments.state.loading.next,
                department: false,
              },
              success: true,
              error: null,
            },
          });
        }
        console.log(`ERROR: ${result}`);
        return dispatch({
          type: 'UPDATE_DEPARTMENTS_STATE',
          data: {
            loading: {
              initial: getState().departments.state.loading.initial,
              refresh: getState().departments.state.loading.refresh,
              next: getState().departments.state.loading.next,
              department: false,
            },
            success: false,
            error: 'server',
          },
        });
      })
      .catch((err) => {
        console.log(`ERROR: ${err}`);
        return dispatch({
          type: 'UPDATE_DEPARTMENTS_STATE',
          data: {
            loading: {
              initial: getState().departments.state.loading.initial,
              refresh: getState().departments.state.loading.refresh,
              next: getState().departments.state.loading.next,
              department: false,
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
 * Créateur d'action pour clearDepartments
 * @returns Action
 */
function clearDepartmentsCreator() {
  return {
    type: 'CLEAR_DEPARTMENTS',
  };
}

/**
 * @docs actions
 * Récupère les infos basiques departments depuis le serveur
 * @param next Si il faut récupérer les departments après le dernier
 */
function updateDepartments(type, params) {
  console.log('Update departments');
  return Store.dispatch(updateDepartmentsCreator(type, params));
}

/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul department
 * @param departmentId L'id de l'department à récuperer
 */
function fetchDepartment(departmentId) {
  return Store.dispatch(fetchDepartmentCreator(departmentId));
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearDepartments() {
  return Store.dispatch(clearDepartmentsCreator());
}

export { updateDepartments, clearDepartments, fetchDepartment };
