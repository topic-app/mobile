import React from 'react';
import { View, ScrollView, Platform, StyleSheet, BackHandler } from 'react-native';
import { Text, Button, ProgressBar, useTheme } from 'react-native-paper';
import StepIndicator from 'react-native-step-indicator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewPager from '@react-native-community/viewpager';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import shortid from 'shortid';

import { RequestState, Theme } from '@ts/types';
import getStyles from '@styles/Styles';

import { TranslucentStatusBar } from './Header';
import { PlatformBackButton } from './PlatformComponents';
import SafeAreaView from './SafeAreaView';

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

function getStepIndicatorStyles(theme: Theme) {
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

function iconColor(status: 'finished' | 'unfinished' | 'current', theme: Theme) {
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

type PageType = {
  icon: string;
  label: string;
  component: React.ReactElement;
  height: number;
  scrollToBottom?: boolean;
};

type EndPageType = {
  icon: string;
  title: string;
  description?: string;
  actions: { label: string; onPress: () => void }[];
};

type Props = {
  title?: string;
  reqState: RequestState;
  pages: PageType[];
  success?: EndPageType;
  failure?: EndPageType;
  viewPagerRef?: React.RefObject<ViewPager>;
};

const StepperViewPager: React.FC<Props> = ({
  title,
  reqState,
  pages,
  success,
  failure,
  viewPagerRef: viewPagerParentRef,
}) => {
  // NOTE: There is tons of room for performance optimization here with useCallback, React.memo, etc.
  const [currentPage, setCurrentPage] = React.useState(0);
  const viewPagerRef = viewPagerParentRef ?? React.createRef<ViewPager>();
  const scrollViewRef = React.createRef<ScrollView>();

  const navigation = useNavigation();

  const onStepPress = (position: number) => {
    if (position < currentPage) {
      setCurrentPage(position);
      viewPagerRef.current?.setPage(position);
    }
  };

  const incrementPage = (num: number) => {
    const newPage = currentPage + num;
    setCurrentPage(newPage);
    viewPagerRef.current?.setPage(newPage);
  };

  const moveForward = () => incrementPage(1);
  const skipForward = () => incrementPage(2);
  const moveBackward = () => incrementPage(-1);

  // Handle back button on Android
  if (Platform.OS === 'android') {
    useFocusEffect(
      React.useCallback(() => {
        const onBackPress = () => {
          if (currentPage === 0 || reqState.success !== null) {
            navigation.goBack();
            return true; // true means we handled the back request and react-navigation leaves us alone
          }
          moveBackward();
          return true;
        };

        BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }, [currentPage]),
    );
  }

  const theme = useTheme();
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
                key={shortid()}
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

  if (reqState.success === false && failure) {
    return (
      <View style={styles.page}>
        <View style={stepperStyles.stepIndicatorContainer}>
          <View style={stepperStyles.centerContainer}>
            <Icon size={50} color={colors.error} name={failure.icon} />
            <Text style={stepperStyles.title}>{failure.title}</Text>
            <Text>{failure.description}</Text>
            <Text>
              Erreur:{' '}
              {reqState.error?.message ||
                reqState.error?.value ||
                reqState.error?.extraMessage ||
                'Inconnu'}
            </Text>
          </View>
        </View>
        <View style={stepperStyles.formContainer}>
          <View style={stepperStyles.buttonContainer}>
            {failure.actions.map((action, key) => (
              <Button
                key={shortid()}
                mode={
                  Platform.OS !== 'ios' && key === failure.actions.length - 1
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
  const pageComponents = pages.map(({ component: Component }, index) => {
    return (
      // eslint-disable-next-line react/no-array-index-key
      <View key={index}>
        {React.cloneElement(Component, {
          forward: moveForward,
          backward: moveBackward,
          skip: skipForward,
        })}
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
          ref={scrollViewRef}
          onLayout={
            pageScrollToBottom[currentPage]
              ? () => scrollViewRef.current?.scrollToEnd({ animated: true })
              : undefined
          }
        >
          <PlatformBackButton onPress={navigation.goBack} />
          <View style={stepperStyles.stepIndicatorContainer}>
            <View style={stepperStyles.centerContainer}>
              <Text style={stepperStyles.title}>{title}</Text>
            </View>
            <StepIndicator
              stepCount={pageLabels.length}
              currentPosition={currentPage}
              labels={pageLabels}
              onPress={onStepPress}
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
            ref={viewPagerRef}
            scrollEnabled={false}
          >
            {pageComponents}
          </ViewPager>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default StepperViewPager;
