/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform, BackHandler } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import getStyles from '@styles/Styles';
import ViewPager from '@react-native-community/viewpager';
import { updateLocation, fetchLocationData } from '@redux/actions/data/location';
import getLandingStyles from '../styles/Styles';

import WelcomeLanding from '../components/Landing';
import WelcomeLocation from '../components/Location';

function done(selected, schools, departments, navigation) {
  updateLocation({
    selected: true,
    schools: schools.map((sch) => sch._id).filter((id) => selected.includes(id)),
    departments: departments.map((dep) => dep._id).filter((id) => selected.includes(id)),
    global: selected.includes('global'),
  });
  navigation.navigate('Main', {
    screen: 'Home1',
    params: { screen: 'Home2', params: { screen: 'Article' } },
  });
}

function LandingWelcome({ navigation }) {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);
  const landingStyles = getLandingStyles(theme);
  const viewpagerRef = React.useRef();

  const [currentPage, setCurrentPage] = React.useState(0);

  function goTo(page) {
    // Note: if you add a route to the viewpager,
    // add it to the page restrictions here!
    if (page !== currentPage) {
      setCurrentPage(page);
      viewpagerRef.current.setPage(page);
    }
  }

  const forward = () => goTo(1);
  const back = () => goTo(0);

  // Handle back button on Android
  if (Platform.OS === 'android') {
    useFocusEffect(
      React.useCallback(() => {
        const onBackPress = () => {
          if (currentPage === 0) {
            navigation.goBack();
            return true; // true means we handled the back request and react-navigation leaves us alone
          }
          back();
          return true;
        };

        BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }, [back, navigation, currentPage]),
    );
  }

  return (
    <ViewPager style={landingStyles.viewpager} ref={viewpagerRef} scrollEnabled={false}>
      <View key="1" style={landingStyles.landingPage}>
        <WelcomeLanding forward={forward} navigation={navigation} />
      </View>
      <View key="2">
        <WelcomeLocation done={done} navigation={navigation} />
      </View>
    </ViewPager>
  );
}

export default LandingWelcome;

LandingWelcome.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
