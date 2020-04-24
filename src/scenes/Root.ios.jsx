import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import MainStackNavigator from './Main';

// Can't use BlurView with expo :(
// import { BlurView, VibrancyView } from '@react-native-community/blur';

function TabItem({ label, onPress, icon, active }) {
  const { colors } = useTheme();
  const color = active ? colors.primary : colors.disabled;
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={{ alignItems: 'center' }}>
          <Icon name={icon} size={28} color={color} />
          <Text style={{ fontSize: 11, color }}>{label}</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

TabItem.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
};

function BottomTabs({ navigation }) {
  const [active, setActive] = React.useState('Article');

  const isActive = (name) => active === name;

  const setActiveAndNavigate = (name, route) => {
    if (!isActive(name)) {
      setActive(name);
      navigation.navigate(...route);
    }
  };

  const { colors } = useTheme();

  const { bottom } = useSafeArea(); // get bottom inset

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.tabBackground,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          padding: 2,
          marginBottom: bottom,
          height: 50,
          width: '100%',
        }}
      >
        <TabItem
          icon="newspaper"
          label="Actus"
          active={isActive('Article')}
          onPress={() =>
            setActiveAndNavigate('Article', [
              'Main',
              {
                screen: 'Home1',
                params: {
                  screen: 'Home2',
                  params: { screen: 'Article', params: { noTransition: true } },
                },
              },
            ])
          }
        />
        <TabItem
          icon="calendar"
          label="Évènements"
          active={isActive('Event')}
          onPress={() =>
            setActiveAndNavigate('Event', [
              'Main',
              {
                screen: 'Home1',
                params: {
                  screen: 'Home2',
                  params: { screen: 'Event', params: { noTransition: true } },
                },
              },
            ])
          }
        />
        <TabItem
          icon="comment-check-outline"
          label="Pétitions"
          active={isActive('Petition')}
          onPress={() =>
            setActiveAndNavigate('Petition', [
              'Main',
              {
                screen: 'Home1',
                params: {
                  screen: 'Home2',
                  params: { screen: 'Petition', params: { noTransition: true } },
                },
              },
            ])
          }
        />
        <TabItem
          icon="compass-outline"
          label="Explorer"
          active={isActive('Explorer')}
          onPress={() =>
            setActiveAndNavigate('Explorer', [
              'Main',
              {
                screen: 'Home1',
                params: {
                  screen: 'Home2',
                  params: { screen: 'Explorer', params: { noTransition: true } },
                },
              },
            ])
          }
        />
        <TabItem
          icon="dots-horizontal"
          label="Plus"
          active={isActive('More')}
          onPress={() =>
            setActiveAndNavigate('More', [
              'Main',
              {
                screen: 'More',
                params: {
                  screen: 'List',
                  params: { noTransition: true },
                },
              },
            ])
          }
        />
      </View>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function MainNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Main"
      tabBar={({ navigation }) => <BottomTabs navigation={navigation} />}
      // tabBar={({ navigation }) => <BottomTabBar />}
    >
      <Tab.Screen name="Main" component={MainStackNavigator} />
    </Tab.Navigator>
  );
}

export default MainNavigator;

BottomTabs.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
