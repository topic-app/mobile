import React from 'react';
import { View, TouchableWithoutFeedback, Platform } from 'react-native';
import { Text, Button, ProgressBar } from 'react-native-paper';
import PropTypes from 'prop-types';
import StepIndicator from 'react-native-step-indicator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewPager from '@react-native-community/viewpager';
import { connect } from 'react-redux';

import { styles, colors } from '../../../styles/Styles';
import { authStyles } from '../styles/Styles';

import AuthCreatePageGeneral from '../components/CreateGeneral';
import AuthCreatePageSchool from '../components/CreateSchool';
import AuthCreatePagePrivacy from '../components/CreatePrivacy';
import AuthCreatePageProfile from '../components/CreateProfile';
import AuthCreatePageLegal from '../components/CreateLegal';

import { register, updateState } from '../../../redux/actions/account';

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
};

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
      return colors.primary;
    default:
      return '#000000';
  }
}

function renderStepIndicator(params) {
  return <Icon color={iconColor(params.stepStatus)} size={15} name={selectIcon(params.position)} />;
}

class AuthCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      onPagePress: null,
    };
    this.viewPager = React.createRef();
  }

  onStepPress = (position) => {
    const { currentPage } = this.state;
    if (position < currentPage) {
      this.setState({ currentPage: position });
      this.viewPager.current.setPage(position);
    }
  };

  moveForward = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 1 });
    this.viewPager.current.setPage(currentPage + 1);
  };

  skipForward = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 2 });
    this.viewPager.current.setPage(currentPage + 2);
  };

  skipBackward = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 2 });
    this.viewPager.current.setPage(currentPage + 2);
  };

  moveBackward = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage - 1 });
    this.viewPager.current.setPage(currentPage - 1);
  };

  restart = () => {
    updateState({ error: null, success: null, loading: null });
    this.setState({ currentPage: 0 });
  };

  setPageOnPress = (func) => {
    this.setState({ onPagePress: func });
  };

  create = () => {
    const { creationData } = this.props;

    const reqParams = {
      accountInfo: {
        username: creationData.username,
        email: creationData.email,
        password: creationData.password,
        global: creationData.global,
        schools: creationData.schools,
        departments: creationData.departments,
        description: null,
        public: creationData.accountType === 'public',
        firstName: creationData.accountType === 'public' ? creationData.firstname : null,
        lastName: creationData.accountType === 'public' ? creationData.lastname : null,
      },
      device: {
        type: 'app',
        deviceId: null,
        canNotify: true,
      },
    };

    register(reqParams);
  };

  render() {
    const { currentPage, onPagePress } = this.state;
    const { navigation, reqState } = this.props;

    if (reqState.success) {
      return (
        <View style={styles.page}>
          <View style={authStyles.stepIndicatorContainer}>
            <View style={authStyles.centerContainer}>
              <Icon size={50} color={colors.valid} name="account-check-outline" />
              <Text style={authStyles.title}>Compte crée</Text>
            </View>
          </View>
          <View style={authStyles.formContainer}>
            <View style={authStyles.buttonContainer}>
              <Button
                mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                uppercase={Platform.OS !== 'ios'}
                onPress={() =>
                  navigation.navigate('Main', {
                    screen: 'Home1',
                    params: { screen: 'Home2', params: { screen: 'Article' } },
                  })
                }
                style={{ flex: 1 }}
              >
                Continuer
              </Button>
            </View>
          </View>
        </View>
      );
    }

    if (reqState.success === false) {
      return (
        <View style={styles.page}>
          <View style={authStyles.stepIndicatorContainer}>
            <View style={authStyles.centerContainer}>
              <Icon size={50} color={colors.text} name="account-remove-outline" />
              <Text style={authStyles.title}>Erreur lors de la création du compte</Text>
              <Text>
                Veuillez vérifier votre connexion internet, réessayer en vérifiant que les données
                soient correctes ou signaler un bug depuis le menu principal
              </Text>
              <Text>
                Erreur:{' '}
                {reqState.error.message ||
                  reqState.error.value ||
                  reqState.error.extraMessage ||
                  'Inconnu'}
              </Text>
            </View>
          </View>
          <View style={authStyles.formContainer}>
            <View style={authStyles.buttonContainer}>
              <Button
                mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                uppercase={Platform.OS !== 'ios'}
                onPress={() => this.restart()}
                style={{ flex: 1 }}
              >
                Recommencer
              </Button>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.page}>
        <TouchableWithoutFeedback onPress={onPagePress} style={{ height: '100%', width: '100%' }}>
          <View style={{ flex: 1 }}>
            {reqState.loading && <ProgressBar indeterminate />}
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
              ref={this.viewPager}
              scrollEnabled={false} // TEMP: Disable this for easier testing
            >
              <View key="1">
                <AuthCreatePageGeneral
                  setPageOnPress={this.setPageOnPress}
                  forward={this.moveForward}
                />
              </View>
              <View key="2">
                <AuthCreatePageSchool
                  setPageOnPress={this.setPageOnPress}
                  forward={this.moveForward}
                  backward={this.moveBackward}
                />
              </View>
              <View key="3">
                <AuthCreatePagePrivacy
                  forward={this.moveForward}
                  backward={this.moveBackward}
                  skip={this.skipForward}
                  setPageOnPress={this.setPageOnPress}
                />
              </View>
              <View key="4">
                <AuthCreatePageProfile
                  setPageOnPress={this.setPageOnPress}
                  forward={this.moveForward}
                  backward={this.moveBackward}
                />
              </View>
              <View key="5">
                <AuthCreatePageLegal
                  setPageOnPress={this.setPageOnPress}
                  forward={this.create}
                  backward={this.moveBackward}
                />
              </View>
            </ViewPager>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { account } = state;
  return { creationData: account.creationData, reqState: account.state };
};

export default connect(mapStateToProps)(AuthCreate);

AuthCreate.defaultProps = {
  creationData: {},
  reqState: {
    error: null,
    success: null,
    loading: false,
  },
};

AuthCreate.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  creationData: PropTypes.shape(),
  reqState: PropTypes.shape({
    error: PropTypes.any,
    success: PropTypes.bool,
    loading: PropTypes.bool,
  }),
};
