import React from 'react';
import { View, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { TabView, TabBar, SceneRendererProps, NavigationState, Route } from 'react-native-tab-view';

type TabBarProps = SceneRendererProps & {
  navigationState: NavigationState<Route>;
};

type PageType = {
  key: string;
  title: string;
  component: React.ReactElement;
  onVisible?: () => void;
};

type Props = {
  pages: PageType[];
  keyboardDismissMode?: 'auto' | 'none' | 'on-drag';
  scrollEnabled?: boolean;
  hideTabBar?: boolean;
  hideTabIndicator?: boolean;
  initialTab?: number;
  preloadDistance?: number;
};

const CustomTabView: React.FC<Props> = ({
  keyboardDismissMode = 'auto',
  pages,
  scrollEnabled = true,
  hideTabBar = false,
  hideTabIndicator = false,
  initialTab = 0,
  preloadDistance,
}) => {
  const theme = useTheme();
  const { colors } = theme;

  const [index, setIndex] = React.useState(initialTab);

  const initialLayout = { width: Dimensions.get('window').width };

  /* const renderScene = SceneMap({
    schools: <SchoolsTab selected={selected.schools} setSelected={setSelected.schools} />,
    departments: DepartmentsTab,
    regions: RegionsTab,
    france: FranceTab,
  }); */

  pages[index].onVisible?.();

  const renderScene = ({ route }: { route: PageType }) => {
    return pages.find((p) => p.key === route.key)!.component;
  };

  const renderTabBar = hideTabBar
    ? () => null
    : (props: TabBarProps) => (
        <TabBar
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
          style={{ backgroundColor: 'transparent', elevation: 0, borderWidth: 0 }}
          indicatorStyle={
            hideTabIndicator
              ? { height: 0, backgroundColor: colors.primary }
              : { backgroundColor: colors.primary }
          }
          activeColor={colors.primary}
          inactiveColor={colors.text}
          pressColor={colors.primary}
          scrollEnabled={scrollEnabled}
        />
      );

  return (
    <View>
      <TabView
        navigationState={{ index, routes: pages }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        keyboardDismissMode={keyboardDismissMode}
        renderTabBar={renderTabBar}
        lazy={preloadDistance !== null}
        lazyPreloadDistance={preloadDistance}
      />
    </View>
  );
};

export default CustomTabView;
