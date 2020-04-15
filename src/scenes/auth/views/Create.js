import React from 'react';
import { View } from 'react-native';
import { Text, TextInput, HelperText, Button } from 'react-native-paper';
import PropTypes from 'prop-types';
import StepIndicator from 'react-native-step-indicator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewPager from '@react-native-community/viewpager';

import { styles, colors } from '../../../styles/Styles';
import { theme } from '../../../styles/Theme';
import { authStyles } from '../styles/Styles';
import AuthCreatePageGeneral from '../components/CreateGeneral';

const stepIndicatorStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: colors.primary,
  stepStrokeWidth: 3,
  separatorStrokeFinishedWidth: 4,
  stepStrokeFinishedColor: colors.primary,
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: colors.primary,
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: colors.primary,
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: colors.primary,
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: colors.primary,
}

const pages = ['general', 'school', 'privacy', 'profile', 'legal'];

function selectIcon(position) {
  switch (position) {
    case 0: {
      return 'account';
    }
    case 1: {
      return 'school';
    }
    case 2: {
      return 'shield';
    }
    case 3: {
      return 'comment-account';
    }
    case 4: {
      return 'script-text';
    }
    default: {
      return 'checkbox-blank-circle-outline';
    }
  }
}

function iconColor(status) {
  switch (status) {
    case 'finished':
      return '#ffffff';
    case 'unfinished':
      return '#aaaaaa';
    case 'current':
      return colors.primary
    default:
      return '#000000';
  }
}

function renderStepIndicator(params) {
  return <Icon
    color={iconColor(params.stepStatus)}
    size={15}
    name={selectIcon(params.position)}
  />
}

class AuthCreate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 0
    }
  }

  onStepPress = (position) => {
    const { currentPage } = this.state;
    if (position < currentPage) {
      this.setState({ currentPage: position });
      this.viewPager.setPage(position);
    }
  }

  moveForward = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 1 });
    this.viewPager.setPage(currentPage + 1);
  }

  moveBackward = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage - 1 });
    this.viewPager.setPage(currentPage - 1);
  }

  render() {
    const { currentPage } = this.state
    return (
      <View style={styles.page}>
        <View style={authStyles.stepIndicatorContainer}>
          <View style={authStyles.centerContainer}>
            <Text style={authStyles.title}>Créer un Compte</Text>
          </View>
          <StepIndicator
            stepCount={5}
            currentPosition={currentPage}
            labels={['General', 'École', 'Vie privée', 'Profil', 'Conditions']}
            onPress={this.onStepPress}
            customStyles={stepIndicatorStyles}
            renderStepIndicator={renderStepIndicator}
          />
        </View>
        <ViewPager
          style={{ flexGrow: 1 }}
          ref={viewPager => {
            this.viewPager = viewPager
          }}
          onPageSelected={page => {
            /*this.setState({ currentPage: page.position })*/
          }}
          scrollEnabled={false}
        >
          <View key="1">
            <AuthCreatePageGeneral forward={this.moveForward} />
          </View>
          <View key="2">
            <Text>HELLO 2</Text>
          </View>
          <View key="3">
            <Text>HELLO 3</Text>
          </View>
          <View key="4">
            <Text>HELLO 4</Text>
          </View>
          <View key="5">
            <Text>HELLO 5</Text>
          </View>
        </ViewPager>
      </View>
    )
  }
}

export default AuthCreate;

AuthCreate.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
