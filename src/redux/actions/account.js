import Store from '../store';
import request from '../../utils/request';

/**
 * @docs actionCreators
 * Ajoute des paramètres aux données de création de compte
 * @param lastId L'id du dernier article, par ordre chronologique, de la liste d'articles/database redux
 * @returns Action
 */
function updateCreationDataCreator(fields) {
  return {
    type: 'UPDATE_CREATION_DATA',
    data: fields
  }
}

function clearCreationDataCreator() {
  return {
    type: 'CLEAR_CREATION_DATA',
    data: {}
  }
}

function updateCreationData(params) {
  console.log(`Update creation data ${JSON.stringify(params)}`);
  return Store.dispatch(updateCreationDataCreator(params));
}

function clearCreationData(params) {
  console.log('Clear creation data');
  return Store.dispatch(clearCreationDataCreator());
}

export { updateCreationData, clearCreationData }
