import React from 'react';

import { createNativeStackNavigator } from '@utils/stack';

import ArticleAddStackNavigator from './articles/index';
import EventAddStackNavigator from './events/index';
import GroupAddStackNavigator from './groups/index';
import PetitionAddStackNavigator from './petitions/index';

type AddStackParams = {
  Article: undefined;
  Event: undefined;
  Group: undefined;
  Petition: undefined;
};

const Stack = createNativeStackNavigator<AddStackParams>();

function AddStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Article" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Article" component={ArticleAddStackNavigator} />
      <Stack.Screen name="Event" component={EventAddStackNavigator} />
      <Stack.Screen name="Group" component={GroupAddStackNavigator} />
      <Stack.Screen name="Petition" component={PetitionAddStackNavigator} />
    </Stack.Navigator>
  );
}

export default AddStackNavigator;
