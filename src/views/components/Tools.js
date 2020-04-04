import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar, View, Platform } from 'react-native';
import { Appbar, Menu } from 'react-native-paper';

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

    const MORE_ICON = Platform === 'ios' ? 'dots-horizontal' : 'dots-vertical';

    const overflowAction =
      overflow !== undefined ? (
        <Menu
          visible={menuVisible}
          onDismiss={this.closeMenu}
          anchor={<Appbar.Action icon={MORE_ICON} onPress={this.openMenu} color={colors.text} />}
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

function HLine({ width, height, color, paddingVertical, borderRadius }) {
  return (
    <View style={{ width: '100%', alignItems: 'center', paddingVertical }}>
      <View style={{ width, height, borderRadius, backgroundColor: color }} />
    </View>
  );
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
        primaryRoute: PropTypes.array,
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

HLine.defaultProps = {
  width: '100%',
  height: 1.5,
  color: colors.outline,
  paddingVertical: 10,
  borderRadius: 20,
};

HLine.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  paddingVertical: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export { HLine, TranslucentStatusBar, CustomHeaderBar };
