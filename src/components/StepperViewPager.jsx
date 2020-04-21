import React from 'react';
import { View, ScrollView, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Button, ProgressBar, IconButton, withTheme } from 'react-native-paper';
import PropTypes from 'prop-types';
import StepIndicator from 'react-native-step-indicator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewPager from '@react-native-community/viewpager';
import { SafeAreaView } from 'react-native-safe-area-context';

import getStyles from '@styles/Styles';
import { TranslucentStatusBar } from './Header';

const stepperStyles = StyleSheet.create({
  centerContainer: {
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
  title: {
    fontSize: 30,
    marginBottom: 10,
  },
  stepIndicatorContainer: {
    margin: 10,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  formContainer: {
    padding: 20,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
});

function getStepIndicatorStyles(theme) {
  const { colors } = theme;
  return {
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
}

function iconColor(status, theme) {
  const { colors } = theme;
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

function PlatformBackButton({ onPress, theme }) {
  const { colors } = theme;
  if (Platform.OS === 'ios') {
    return (
      <TouchableOpacity onPress={onPress}>
        <Icon name="chevron-left" color={colors.text} size={30} style={stepperStyles.backButton} />
      </TouchableOpacity>
    );
  }
  return (
    <IconButton icon="arrow-left" size={25} style={stepperStyles.backButton} onPress={onPress} />
  );
}

class StepperViewPager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
    };
    const { viewPagerRef } = props;

    this.viewPagerRef = viewPagerRef ?? React.createRef();
    this.scrollViewRef = React.createRef();
  }

  onStepPress = (position) => {
    const { currentPage } = this.state;
    if (position < currentPage) {
      this.setState({ currentPage: position });
      this.viewPagerRef.current.setPage(position);
    }
  };

  moveForward = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 1 });
    this.viewPagerRef.current.setPage(currentPage + 1);
  };

  skipForward = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 2 });
    this.viewPagerRef.current.setPage(currentPage + 2);
  };

  moveBackward = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage - 1 });
    this.viewPagerRef.current.setPage(currentPage - 1);
  };

  render() {
    const { navigation, reqState, pages, success, failure, theme } = this.props;
    const { currentPage } = this.state;

    const styles = getStyles(theme);
    const { colors } = theme;

    if (reqState.success && success) {
      return (
        <View style={styles.page}>
          <View style={stepperStyles.stepIndicatorContainer}>
            <View style={stepperStyles.centerContainer}>
              <Icon size={50} color={colors.valid} name={success.icon} />
              <Text style={stepperStyles.title}>{success.title}</Text>
              <Text>{success.description}</Text>
            </View>
          </View>
          <View style={stepperStyles.formContainer}>
            <View style={stepperStyles.buttonContainer}>
              {success.actions.map((action, key) => (
                <Button
                  mode={
                    Platform.OS !== 'ios' && key === success.actions.length - 1
                      ? 'contained'
                      : 'outlined'
                  }
                  uppercase={Platform.OS !== 'ios'}
                  onPress={action.onPress}
                  style={{ flex: 1 }}
                >
                  {action.label}
                </Button>
              ))}
            </View>
          </View>
        </View>
      );
    }

    if (reqState.success === false) {
      return (
        <View style={styles.page}>
          <View style={stepperStyles.stepIndicatorContainer}>
            <View style={stepperStyles.centerContainer}>
              <Icon size={50} color={colors.error} name={failure.icon} />
              <Text style={stepperStyles.title}>{failure.title}</Text>
              <Text>{failure.description}</Text>
              <Text>
                Erreur:{' '}
                {reqState.error.message ||
                  reqState.error.value ||
                  reqState.error.extraMessage ||
                  'Inconnu'}
              </Text>
            </View>
          </View>
          <View style={stepperStyles.formContainer}>
            <View style={stepperStyles.buttonContainer}>
              {failure.actions.map((action, key) => (
                <Button
                  mode={
                    Platform.OS !== 'ios' && key === success.actions.length - 1
                      ? 'contained'
                      : 'outlined'
                  }
                  uppercase={Platform.OS !== 'ios'}
                  onPress={action.onPress}
                  style={{ flex: 1 }}
                >
                  {action.label}
                </Button>
              ))}
            </View>
          </View>
        </View>
      );
    }

    const pageScrollToBottom = pages.map((item) => item.scrollToBottom);
    const pageLabels = pages.map((item) => item.label);
    const pageIcons = pages.map((item) => item.icon);
    const pageHeights = pages.map((item) => item.height);
    const pageComponents = pages.map(({ component: Component, params }, key) => {
      return (
        // eslint-disable-next-line react/no-array-index-key
        <View key={key}>
          <Component
            forward={this.moveForward}
            backward={this.moveBackward}
            skip={this.skipForward}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...(params && params)}
          />
        </View>
      );
    });
    const stepIndicatorStyles = getStepIndicatorStyles(theme);

    return (
      <View style={styles.page}>
        <SafeAreaView style={{ flex: 1 }}>
          <TranslucentStatusBar />
          {reqState.loading ? <ProgressBar indeterminate /> : <View style={{ height: 4 }} />}
          <ScrollView
            ref={this.scrollViewRef}
            onLayout={
              pageScrollToBottom[currentPage] &&
              (() => this.scrollViewRef.current.scrollToEnd({ animated: true }))
            }
          >
            <PlatformBackButton onPress={navigation.goBack} theme={theme} />
            <View style={stepperStyles.stepIndicatorContainer}>
              <View style={stepperStyles.centerContainer}>
                <Text style={stepperStyles.title}>Créer un Compte</Text>
              </View>
              <StepIndicator
                stepCount={pageLabels.length}
                currentPosition={currentPage}
                labels={pageLabels}
                onPress={this.onStepPress}
                customStyles={stepIndicatorStyles}
                renderStepIndicator={(params) => (
                  <Icon
                    color={iconColor(params.stepStatus, theme)}
                    size={15}
                    name={pageIcons[params.position]}
                  />
                )}
              />
            </View>
            <ViewPager
              style={{ flexGrow: 1, height: pageHeights[currentPage] }}
              ref={this.viewPagerRef}
              scrollEnabled={false}
            >
              {pageComponents}
            </ViewPager>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

export default withTheme(StepperViewPager);

StepperViewPager.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  reqState: PropTypes.shape({
    error: PropTypes.any,
    success: PropTypes.bool,
    loading: PropTypes.bool,
  }),
  viewPagerRef: PropTypes.shape({
    current: PropTypes.shape({
      setPage: PropTypes.func.isRequired,
    }),
  }),
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
      height: PropTypes.number.isRequired,
      scrollToBottom: PropTypes.bool,
    }).isRequired,
  ).isRequired,
  success: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        onPress: PropTypes.func.isRequired,
      }).isRequired,
    ),
  }),
  failure: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        onPress: PropTypes.func.isRequired,
      }).isRequired,
    ),
  }),
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      valid: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      error: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

StepperViewPager.defaultProps = {
  reqState: {
    error: null,
    success: null,
    loading: false,
  },
  success: null,
  failure: null,
  viewPagerRef: null,
};

PlatformBackButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      valid: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
