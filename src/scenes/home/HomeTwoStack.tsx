import { CompositeNavigationProp } from '@react-navigation/core';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Config } from '@constants/index';
import getNavigatorStyles from '@styles/NavStyles';
import { useTheme, useSafeAreaInsets } from '@utils/index';

import { HomeOneScreenNavigationProp } from './HomeOne';
import ArticleList from './articles/views/List';
import EventDualList from './events/views/Dual';
import EventList from './events/views/List';
import ExplorerList from './explorer/views/List';
import ListScreen from './list/views/List';

// import PetitionList from './petitions/views/List';

export type HomeTwoNavParams = {
  Article: { initialList?: string } | undefined;
  Event: { initialList?: string } | undefined;
  Petition: undefined;
  Explorer: undefined;
  Tests: undefined;
  List: undefined;
};

export type HomeTwoScreenNavigationProp<K extends keyof HomeTwoNavParams> = CompositeNavigationProp<
  StackNavigationProp<HomeTwoNavParams, K>,
  HomeOneScreenNavigationProp<'Home2'>
>;

const Stack = createStackNavigator<HomeTwoNavParams>();

function HomeTwoNavigator() {
  const theme = useTheme();
  const { colors } = theme;
  const navigatorStyles = getNavigatorStyles(theme);

  const insets = useSafeAreaInsets();

  const deviceWidth = useWindowDimensions().width;

  return (
    <Stack.Navigator initialRouteName="Article" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Article" component={ArticleList} options={{ title: 'Actus' }} />
      <Stack.Screen
        name="Event"
        component={deviceWidth > Config.layout.dualMinWidth ? EventDualList : EventList}
        options={{ title: 'Évènements' }}
      />
      {/* <Tab.Screen name="Petition" component={PetitionList} options={{ title: 'Pétitions' }} /> */}
      <Stack.Screen name="Explorer" component={ExplorerList} options={{ title: 'Explorer' }} />
      <Stack.Screen name="List" component={ListScreen} options={{ title: 'Plus' }} />
    </Stack.Navigator>
  );
}

export default HomeTwoNavigator;
