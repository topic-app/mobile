import React from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { TabView, TabBar } from 'react-native-tab-view';

function CustomTabView({
  keyboardDismissMode,
  pages,
  scrollEnabled,
  hideTabBar,
  hideTabIndicator,
  initialTab,
}) {
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

  const renderScene = ({ route }) => {
    return pages.find((p) => p.key === route.key).component;
  };

  if (pages[index].onVisible) {
    pages[index].onVisible();
  }

  const renderTabBar = hideTabBar
    ? () => null
    : (props) => (
        <TabBar
          // eslint-disable-next-line
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
      />
    </View>
  );
}

CustomTabView.defaultProps = {
  keyboardDismissMode: 'auto',
  scrollEnabled: true,
  hideTabBar: false,
  hideTabIndicator: false,
  initialTab: 0,
};

CustomTabView.propTypes = {
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
  hideTabBar: PropTypes.bool,
  hideTabIndicator: PropTypes.bool,
  initialTab: PropTypes.number,
};

export default CustomTabView;
