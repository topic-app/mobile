import Store from '@redux/store';

import { UPDATE_GROUPS_CREATION_DATA, GroupCreationData } from '@ts/types';

import { updateCreationDataCreator, clearCreationDataCreator } from './ActionCreator';

async function updateGroupCreationData(fields: GroupCreationData) {
  Store.dispatch(
    updateCreationDataCreator({
      updateCreationData: UPDATE_GROUPS_CREATION_DATA,
      dataType: 'groupData',
      fields,
    }),
  );
}

async function clearGroupCreationData() {
  Store.dispatch(
    clearCreationDataCreator({
      dataType: 'groupData',
      updateCreationData: UPDATE_GROUPS_CREATION_DATA,
    }),
  );
}

export { updateGroupCreationData, clearGroupCreationData };
