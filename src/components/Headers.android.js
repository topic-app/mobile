import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar, View } from 'react-native';
import { Appbar, Menu } from 'react-native-paper';
import { TransitionPresets } from '@react-navigation/stack';

import { theme, colors } from '../../styles/Theme';
import { navigatorStyles } from '../../styles/navigatorStyles';

function TranslucentStatusBar({ contentThemeName }) {
  let translucent = false;
  if (theme.statusBarTranslucent) {
    translucent = true;
  }
  return (
    <StatusBar
      translucent={translucent}
      backgroundColor={colors.statusBar}
      barStyle={`${contentThemeName}-content`}
    />
  );
}

class CustomHeaderBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: false,
    };
  }

  openMenu = () => {
    this.setState({ menuVisible: true });
  };

  closeMenu = () => {
    this.setState({ menuVisible: false });
  };

  render() {
    const { menuVisible } = this.state;
    const { scene, previous, navigation } = this.props;

    const {
      title,
      subtitle,
      headerStyle,
      primary,
      drawer,
      actions,
      overflow,
    } = scene.descriptor.options;

    const headerTitle = title !== undefined ? title : scene.route.name;
    const style = headerStyle !== undefined ? headerStyle : navigatorStyles.header;

    let primaryAction;
    if (primary !== undefined) {
      primaryAction = <Appbar.BackAction onPress={primary} />;
    } else if (drawer) {
      primaryAction = <Appbar.Action icon="menu" onPress={navigation.openDrawer} />;
    } else if (previous !== undefined) {
      primaryAction = <Appbar.BackAction onPress={navigation.goBack} />;
    }

    let secondaryActions;
    if (actions !== undefined) {
      secondaryActions = actions.map((item, key) => (
        // eslint-disable-next-line react/no-array-index-key
        <Appbar.Action key={key} icon={item.icon} onPress={item.onPress} />
      ));
    }

    const overflowAction =
      overflow !== undefined ? (
        <Menu
          visible={menuVisible}
          onDismiss={this.closeMenu}
          anchor={
            <Appbar.Action icon="dots-vertical" onPress={this.openMenu} color={colors.text} />
          }
          statusBarHeight={StatusBar.currentHeight}
        >
          {overflow.map((item, key) => (
            // eslint-disable-next-line react/no-array-index-key
            <Menu.Item key={key} title={item.title} icon={item.icon} onPress={item.onPress} />
          ))}
        </Menu>
      ) : null;

    return (
      <View style={navigatorStyles.headerSurface}>
        <TranslucentStatusBar />
        <Appbar.Header style={style} statusBarHeight={StatusBar.currentHeight}>
          {primaryAction}
          <Appbar.Content title={headerTitle} subtitle={subtitle} />
          {secondaryActions}
          {overflowAction}
        </Appbar.Header>
      </View>
    );
  }
}

TranslucentStatusBar.propTypes = {
  contentThemeName: PropTypes.string,
};

TranslucentStatusBar.defaultProps = {
  contentThemeName: theme.dark === true ? 'light' : 'dark',
};

CustomHeaderBar.propTypes = {
  scene: PropTypes.shape({
    descriptor: PropTypes.shape({
      options: PropTypes.shape({
        title: PropTypes.string,
        subtitle: PropTypes.string,
        headerStyle: PropTypes.object,
        primary: PropTypes.func,
        searchRoute: PropTypes.array,
        drawer: PropTypes.bool,
        overflow: PropTypes.arrayOf(PropTypes.object),
        actions: PropTypes.arrayOf(PropTypes.object),
      }).isRequired,
    }).isRequired,
    route: PropTypes.shape({
      name: PropTypes.string,
    }).isRequired,
  }).isRequired,
  previous: PropTypes.shape({
    descriptor: PropTypes.object,
    progress: PropTypes.object,
    route: PropTypes.object,
  }),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    openDrawer: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

CustomHeaderBar.defaultProps = {
  previous: undefined,
};

/*
const nativeZoomInPreset = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: {
      animation: 'spring',
      config: {
        damping: 1000,
        mass: 2,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
        stiffness: 900,
      },
    },
    close: {
      animation: 'spring',
      config: {
        damping: 1000,
        mass: 2,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
        stiffness: 900,
      },
    },
  },
  cardStyleInterpolator: (p) => {
    const { current, next } = p;
    return {
      cardStyle: {
        transform: [
          {
            scale: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.85, 1],
            }),
          },
          {
            scale: next
              ? next.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.1],
                })
              : 1,
          },
        ],
        opacity: current.progress.interpolate({
          inputRange: [0, 0.1, 0.1, 1],
          outputRange: [0, 0, 1, 1],
        }),
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    };
  },
};
*/

const springConfig = {
  animation: 'spring',
  config: {
    damping: 1000,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 10,
    restSpeedThreshold: 10,
    stiffness: 900,
  },
};

const SlideRightAndScaleTransition = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: springConfig,
    close: springConfig,
  },
  cardStyleInterpolator: ({ current, next, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
          {
            scale: next
              ? next.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.95],
                })
              : 1,
          },
        ],
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.9],
        }),
      },
    };
  },
};

const ListHeaderConfig = {
  header: ({ scene, previous, navigation }) => (
    <CustomHeaderBar scene={scene} previous={previous} navigation={navigation} />
  ),
};

const DisplayHeaderConfig = {
  // ...SlideRightAndScaleTransition,
  ...TransitionPresets.SlideFromRightIOS,
  header: ({ scene, previous, navigation }) => (
    <CustomHeaderBar scene={scene} previous={previous} navigation={navigation} />
  ),
};

export { TranslucentStatusBar, ListHeaderConfig, DisplayHeaderConfig };
