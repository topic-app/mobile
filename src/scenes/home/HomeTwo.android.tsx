import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import config from '@constants/config';
import getNavigatorStyles from '@styles/NavStyles';
import { useTheme, useSafeAreaInsets } from '@utils/index';

import ArticleDualList from './articles/views/Dual';
import ArticleList from './articles/views/List';
import EventDualList from './events/views/Dual';
import EventList from './events/views/List';
import ExplorerList from './explorer/views/List';

// import PetitionList from './petitions/views/List';

export type HomeTwoNavParams = {
  Article: { initialList: string } | undefined;
  Event: undefined;
  Petition: undefined;
  Explorer: undefined;
};

const Tab = createMaterialBottomTabNavigator<HomeTwoNavParams>();

function HomeTwoNavigator() {
  const theme = useTheme();
  const { colors } = theme;
  const navigatorStyles = getNavigatorStyles(theme);

  const insets = useSafeAreaInsets();

  const [deviceWidth, setDeviceWidth] = React.useState(Dimensions.get('window').width);

  React.useEffect(() => {
    Dimensions.addEventListener('change', () => setDeviceWidth(Dimensions.get('window').width));
  }, [null]);

  return (
    <Tab.Navigator
      shifting={false}
      initialRouteName="Article"
      activeColor={colors.bottomBarActive}
      inactiveColor={colors.bottomBarInactive}
      barStyle={[
        navigatorStyles.barStyle,
        { backgroundColor: colors.bottomBar, paddingBottom: insets.bottom },
      ]}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          switch (route.name) {
            case 'Article':
              iconName = 'newspaper';
              break;
            case 'Event':
              iconName = 'calendar';
              break;
            case 'Petition':
              iconName = 'comment-check-outline';
              break;
            case 'Explorer':
              iconName = 'compass-outline';
              break;
            default:
              iconName = 'shape';
          }

          return <Icon name={iconName} size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Article"
        component={deviceWidth > config.layout.dualMinWidth ? ArticleDualList : ArticleList}
        options={{ title: 'Actus' }}
      />
      <Tab.Screen
        name="Event"
        component={deviceWidth > config.layout.dualMinWidth ? EventDualList : EventList}
        options={{ title: 'Evènements' }}
      />
      {/* <Tab.Screen name="Petition" component={PetitionList} options={{ title: 'Pétitions' }} /> */}
      <Tab.Screen name="Explorer" component={ExplorerList} options={{ title: 'Explorer' }} />
    </Tab.Navigator>
  );
}

export default HomeTwoNavigator;
