import React from 'react';
import { StatusBar, View, StatusBarProps, ViewStyle, StyleProp } from 'react-native';
import { Appbar, Menu, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';
import shortid from 'shortid';

import { useSafeAreaInsets, getLayout } from '@utils/index';
import getNavigatorStyles from '@styles/NavStyles';

const TranslucentStatusBar: React.FC<StatusBarProps> = ({ barStyle, ...rest }) => {
  const theme = useTheme();
  const { colors } = theme;
  const contentTheme = barStyle || theme.statusBarStyle;
  return (
    <StatusBar translucent backgroundColor={colors.statusBar} barStyle={contentTheme} {...rest} />
  );
};

type OverflowItem = {
  title: string;
  icon?: string;
  onPress: () => void;
};

type ActionItem = {
  icon: string;
  onPress: () => void;
};

export type CustomHeaderBarProps = {
  scene: {
    descriptor: {
      options: {
        title: string;
        subtitle?: string;
        headerStyle?: StyleProp<ViewStyle>;
        primary?: () => void;
        home?: boolean;
        actions?: ActionItem[];
        overflow?: OverflowItem[];
      };
    };
  };
};

const CustomHeaderBar: React.FC<CustomHeaderBarProps> = ({ scene }) => {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const navigatorStyles = getNavigatorStyles(useTheme());
  const { colors } = useTheme();
  const navigation = useNavigation();

  const {
    title,
    subtitle,
    headerStyle,
    primary,
    home = false,
    actions = [],
    overflow,
  } = scene.descriptor.options;

  let primaryAction;
  if (primary) {
    primaryAction = <Appbar.BackAction onPress={primary} />;
  } else if (home) {
    console.log(getLayout());
    primaryAction =
      getLayout() === 'desktop' ? null : (
        <Appbar.Action icon="menu" onPress={navigation.openDrawer} />
      );
  } else {
    primaryAction = <Appbar.BackAction onPress={navigation.goBack} />;
  }

  const secondaryActions = actions.map((item) => (
    <Appbar.Action key={shortid()} icon={item.icon} onPress={item.onPress} />
  ));

  const insets = useSafeAreaInsets();

  const overflowAction = overflow && (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={
        <Appbar.Action
          icon="dots-vertical"
          onPress={() => setMenuVisible(true)}
          color={colors.drawerContent}
        />
      }
      statusBarHeight={insets.top}
    >
      {overflow.map((item, key) => (
        // eslint-disable-next-line react/no-array-index-key
        <Menu.Item
          key={key}
          title={item.title}
          icon={item.icon}
          onPress={() => {
            setMenuVisible(false);
            if (item.onPress) item.onPress();
          }}
        />
      ))}
    </Menu>
  );

  return (
    <View style={navigatorStyles.headerSurface}>
      <TranslucentStatusBar />
      <Appbar.Header style={[navigatorStyles.header, headerStyle]} statusBarHeight={insets.top}>
        {primaryAction}
        <Appbar.Content title={title} subtitle={subtitle} />
        {secondaryActions}
        {overflowAction}
      </Appbar.Header>
    </View>
  );
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

const HeaderConfig = {
  header: ({ scene }: CustomHeaderBarProps) => <CustomHeaderBar scene={scene} />,
};

export { TranslucentStatusBar, HeaderConfig, CustomHeaderBar };