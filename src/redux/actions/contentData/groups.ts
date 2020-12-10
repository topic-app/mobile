import Store from '@redux/store';
import { UPDATE_GROUPS_CREATION_DATA, GroupCreationData } from '@ts/types';
import { updateCreationDataCreator, clearCreationDataCreator } from './ActionCreator';


import { clearCreator } from '../api/ActionCreator';

async function updateGroupCreationData(fields: GroupCreationData) {
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
