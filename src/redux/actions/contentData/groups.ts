import Store from '@redux/store';

import { updateCreationDataCreator, clearCreationDataCreator } from './ActionCreator';

import { UPDATE_GROUPS_CREATION_DATA } from '@ts/types';

import { clearCreator } from '../api/ActionCreator';

async function updateGroupCreationData(fields) {
  await Store.dispatch(
    updateCreationDataCreator({
      updateCreationData: UPDATE_GROUPS_CREATION_DATA,
      dataType: 'groupData',
      fields,
    }),
  );
}

async function clearGroupCreationData() {
  await Store.dispatch(
    clearCreationDataCreator({
      updateCreationData: UPDATE_GROUPS_CREATION_DATA,
    }),
  );
}

export { updateGroupCreationData, clearGroupCreationData };
