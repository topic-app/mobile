import React from 'react';

// TODO: Define GroupCreationData
import { ReduxLocation, GroupCreationData } from '@ts/types';
import { createNativeStackNavigator } from '@utils/stack';

import GroupAdd from './views/Add';
import GroupAddSuccess from './views/AddSuccess';
import GroupAddLocation from './views/AddLocation';

export type GroupAddStackParams = {
  Add: undefined;
  Success: { id?: string; creationData?: GroupCreationData };
  Location: {
    hideSearch: boolean;
    type: 'schools' | 'departements' | 'regions' | 'other';
    initialData?: ReduxLocation;
    callback: (location: ReduxLocation) => any;
  };
};

const Stack = createNativeStackNavigator<GroupAddStackParams>();

function GroupAddStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Add" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Add" component={GroupAdd} options={{ title: 'Créer un groupe' }} />
      <Stack.Screen
        name="Success"
        component={GroupAddSuccess}
        options={{ title: 'Groupe ajouté' }}
      />
      <Stack.Screen
        name="Location"
        component={GroupAddLocation}
        options={{ title: 'Localisation' }}
      />
    </Stack.Navigator>
  );
}

export default GroupAddStackNavigator;
