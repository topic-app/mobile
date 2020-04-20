import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar, View } from 'react-native';
import { Appbar, Menu, withTheme } from 'react-native-paper';
import { TransitionPresets } from '@react-navigation/stack';

import getNavigatorStyles from '../styles/NavStyles';

function TranslucentStatusBarUnthemed({ contentThemeName, theme }) {
  const contentTheme = contentThemeName || theme.statusBarContentTheme;
  const { colors } = theme;
  return (
    <StatusBar
      translucent
      backgroundColor={colors.statusBar}
      barStyle={`${contentTheme}-content`}
    />
  );
}

function SolidStatusBarUnthemed({ color, contentThemeName, theme }) {
  const contentTheme = contentThemeName || theme.statusBarContentTheme;
  const backgroundColor = color || theme.colors.background;
  return (
    <StatusBar
      translucent={false}
      backgroundColor={backgroundColor}
      barStyle={`${contentTheme}-content`}
    />
  );
}

const TranslucentStatusBar = withTheme(TranslucentStatusBarUnthemed);
const SolidStatusBar = withTheme(SolidStatusBarUnthemed);

class CustomHeaderBarUnthemed extends React.Component {
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
    const { scene, navigation, theme } = this.props;

    const navigatorStyles = getNavigatorStyles(theme);
    const { colors } = theme;

    const {
      title,
      subtitle,
      headerStyle,
      primary,
      home,
      actions,
      overflow,
    } = scene.descriptor.options;

    const headerTitle = title !== undefined ? title : scene.route.name;

    let primaryAction;
    if (primary !== undefined) {
      primaryAction = <Appbar.BackAction onPress={primary} />;
    } else if (home) {
      primaryAction = <Appbar.Action icon="menu" onPress={navigation.openDrawer} />;
    } else {
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
        <Appbar.Header
          style={[navigatorStyles.header, headerStyle ?? null]}
          statusBarHeight={StatusBar.currentHeight}
        >
          {primaryAction}
          <Appbar.Content title={headerTitle} subtitle={subtitle} />
          {secondaryActions}
          {overflowAction}
        </Appbar.Header>
      </View>
    );
  }
}

const CustomHeaderBar = withTheme(CustomHeaderBarUnthemed);

TranslucentStatusBarUnthemed.propTypes = {
  contentThemeName: PropTypes.string,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      statusBar: PropTypes.string.isRequired,
    }).isRequired,
    statusBarContentTheme: PropTypes.string.isRequired,
  }).isRequired,
};

TranslucentStatusBarUnthemed.defaultProps = {
  contentThemeName: '',
};

SolidStatusBarUnthemed.propTypes = {
  color: PropTypes.string.isRequired,
  contentThemeName: PropTypes.string,
  theme: PropTypes.shape({
    statusBarContentTheme: PropTypes.string.isRequired,
    colors: PropTypes.shape({
      background: PropTypes.shape.isRequired,
    }).isRequired,
  }).isRequired,
};

SolidStatusBarUnthemed.defaultProps = {
  contentThemeName: '',
};

CustomHeaderBarUnthemed.propTypes = {
  scene: PropTypes.shape({
    descriptor: PropTypes.shape({
      options: PropTypes.shape({
        title: PropTypes.string,
        subtitle: PropTypes.string,
        headerStyle: PropTypes.object,
        primary: PropTypes.func,
        home: PropTypes.bool,
        overflow: PropTypes.arrayOf(PropTypes.object),
        actions: PropTypes.arrayOf(PropTypes.object),
      }).isRequired,
    }).isRequired,
    route: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    openDrawer: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      valid: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
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

const HeaderConfig = {
  header: ({ scene, navigation }) => <CustomHeaderBar scene={scene} navigation={navigation} />,
};

const TransitionHeaderConfig = {
  // ...SlideRightAndScaleTransition,
  ...TransitionPresets.DefaultTransition,
  header: ({ scene, navigation }) => <CustomHeaderBar scene={scene} navigation={navigation} />,
};

export {
  TranslucentStatusBar,
  SolidStatusBar,
  HeaderConfig,
  TransitionHeaderConfig,
  CustomHeaderBar,
};
