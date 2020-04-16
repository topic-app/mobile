import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, TextInput, HelperText, Button } from 'react-native-paper';
import PropTypes from 'prop-types';
import StepIndicator from 'react-native-step-indicator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewPager from '@react-native-community/viewpager';

import { styles, colors } from '../../../styles/Styles';
import { theme } from '../../../styles/Theme';
import { authStyles } from '../styles/Styles';

import AuthCreatePageGeneral from '../components/CreateGeneral';
import AuthCreatePageSchool from '../components/CreateSchool';
import AuthCreatePagePrivacy from '../components/CreatePrivacy';
import AuthCreatePageProfile from '../components/CreateProfile';
import AuthCreatePageLegal from '../components/CreateLegal';

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
  stepIndicatorUnFinishedColor: colors.background,
  stepIndicatorCurrentColor: colors.background,
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: colors.primary,
  stepIndicatorLabelFinishedColor: colors.background,
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: colors.primary,
}

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

  skipForward = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 2 });
    this.viewPager.setPage(currentPage + 2);
  }

  skipBackward = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 2 });
    this.viewPager.setPage(currentPage + 2);
  }

  moveBackward = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage - 1 });
    this.viewPager.setPage(currentPage - 1);
  }

  create = () => {
    console.log("create")
  }

  render() {
    const { currentPage } = this.state;
    const { navigation } = this.props;
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
            /* this.setState({ currentPage: page.position }) */
          }}
          scrollEnabled={false} // TEMP: Disable this for easier testing
        >
          <View key="1">
            <AuthCreatePageGeneral forward={this.moveForward} />
          </View>
          <View key="2">
            <AuthCreatePageSchool forward={this.moveForward} backward={this.moveBackward} />
          </View>
          <View key="3">
            <AuthCreatePagePrivacy forward={this.moveForward} backward={this.moveBackward} skip={this.skipForward} />
          </View>
          <View key="4">
            <AuthCreatePageProfile forward={this.moveForward} backward={this.moveBackward} />
          </View>
          <View key="5">
            <AuthCreatePageLegal forward={this.create} backward={this.moveBackward} />
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
