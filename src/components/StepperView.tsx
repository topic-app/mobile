import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import StepIndicator from 'react-native-step-indicator';
import { TabView, SceneRendererProps, NavigationState, Route } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Theme } from '@ts/types';
import { useTheme } from '@utils/index';

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

function iconColor(status: string, theme: Theme) {
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

type TabBarProps = SceneRendererProps & {
  navigationState: NavigationState<Route>;
};

export type StepperViewPageProps = {
  next: () => void;
  prev: () => void;
  index: number;
  setIndex: (newIndex: number) => void;
};

type PageType = {
  key: string;
  title: string;
  icon: string;
  component: (props: StepperViewPageProps) => React.ReactElement;
  onVisible?: () => void;
};

type Props = {
  pages: PageType[];
  title?: string;
  keyboardDismissMode?: 'auto' | 'none' | 'on-drag';
  swipeEnabled?: boolean;
  hideTabBar?: boolean;
  preloadDistance?: number;
  onChange?: () => any;
};

const StepperView: React.FC<Props> = ({
  pages,
  title,
  keyboardDismissMode = 'auto',
  swipeEnabled = false,
  hideTabBar = false,
  preloadDistance = 0,
  onChange = () => {},
}) => {
  const theme = useTheme();
  const stepIndicatorStyles = getStepIndicatorStyles(theme);

  const [index, setIndex] = React.useState(0);

  const initialLayout = { width: Dimensions.get('window').width };

  const renderScene = ({ route }: { route: PageType }) => {
    const i = pages.findIndex((page) => page.key === route.key);

    return pages[i].component({
      next: () => {
        setIndex(i + 1);
        onChange();
      },
      prev: () => {
        setIndex(i - 1);
        onChange();
      },
      index,
      setIndex,
    });
  };

  pages[index]?.onVisible?.();

  const StepperTabBar: React.FC<TabBarProps> = ({ navigationState }) => (
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

  return (
    <View>
      <TabView
        lazy={preloadDistance !== null}
        lazyPreloadDistance={preloadDistance}
        swipeEnabled={swipeEnabled}
        navigationState={{ index, routes: pages }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        keyboardDismissMode={keyboardDismissMode}
        renderTabBar={!hideTabBar ? StepperTabBar : () => null}
      />
    </View>
  );
};

export default StepperView;
