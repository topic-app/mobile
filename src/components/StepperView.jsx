import React from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions, StyleSheet } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import { TabView, TabBar } from 'react-native-tab-view';
import StepIndicator from 'react-native-step-indicator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

function StepperView({ keyboardDismissMode, pages, scrollEnabled, title }) {
  const theme = useTheme();
  const { colors } = theme;

  const stepIndicatorStyles = getStepIndicatorStyles(theme);

  const [index, setIndex] = React.useState(0);

  const next = (num = 1) => setIndex(index + num);
  const prev = (num = 1) => setIndex(index - num);

  const initialLayout = { width: Dimensions.get('window').width };

  const renderScene = ({ route }) => {
    console.log(pages.find((p) => p.key === route.key).component);
    return React.cloneElement(pages.find((p) => p.key === route.key).component, {
      next,
      prev,
      index,
      setIndex,
    });
  };
  renderScene.propTypes = {
    route: PropTypes.shape({
      key: PropTypes.string.isRequired,
    }).isRequired,
  };

  if (pages[index]?.onVisible) {
    pages[index].onVisible();
  }

  const renderTabBar = ({ navigationState }) => (
    <View style={stepperStyles.stepIndicatorContainer}>
      {title ? (
        <View style={stepperStyles.centerContainer}>
          <Text style={stepperStyles.title}>{title}</Text>
        </View>
      ) : null}
      <StepIndicator
        stepCount={pages.length}
        currentPosition={navigationState.index}
        labels={pages.map((p) => p.title)}
        onPress={() => {
          console.log('Step perssed');
        }}
        customStyles={stepIndicatorStyles}
        renderStepIndicator={(params) => (
          <Icon
            color={iconColor(params.stepStatus, theme)}
            size={15}
            name={pages[params.position].icon}
          />
        )}
      />
    </View>
  );
  renderTabBar.propTypes = {
    navigationState: PropTypes.shape({
      index: PropTypes.number.isRequired,
    }).isRequired,
  };

  return (
    <View>
      <TabView
        navigationState={{ index, routes: pages }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        keyboardDismissMode={keyboardDismissMode}
        renderTabBar={renderTabBar}
      />
    </View>
  );
}

StepperView.defaultProps = {
  keyboardDismissMode: 'auto',
  scrollEnabled: false,
  title: null,
};

StepperView.propTypes = {
  keyboardDismissMode: PropTypes.string,
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
      onVisible: PropTypes.func,
    }),
  ).isRequired,
  scrollEnabled: PropTypes.bool,
  title: PropTypes.string,
};

export default StepperView;
