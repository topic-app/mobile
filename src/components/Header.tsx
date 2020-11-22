import { useNavigation } from '@react-navigation/core';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import React from 'react';
import { StatusBar, View, StatusBarProps, ViewStyle, StyleProp } from 'react-native';
import { Appbar, Menu } from 'react-native-paper';
import shortid from 'shortid';

import getNavigatorStyles from '@styles/NavStyles';
import { useTheme, useSafeAreaInsets, useLayout } from '@utils/index';

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
        hideBack?: boolean;
      };
    };
  };
};

const CustomHeaderBar: React.FC<CustomHeaderBarProps> = ({ scene }) => {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const navigatorStyles = getNavigatorStyles(useTheme());
  const { colors } = useTheme();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const {
    title,
    subtitle,
    headerStyle,
    primary,
    home = false,
    actions = [],
    overflow,
    hideBack = false,
  } = scene.descriptor.options;

  const layout = useLayout();

  let primaryAction;
  if (primary) {
    primaryAction = <Appbar.BackAction onPress={primary} />;
  } else if (home) {
    primaryAction =
      layout === 'desktop' ? null : <Appbar.Action icon="menu" onPress={navigation.openDrawer} />;
  } else {
    primaryAction = hideBack ? null : <Appbar.BackAction onPress={navigation.goBack} />;
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
        <Menu.Item
          // eslint-disable-next-line react/no-array-index-key
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
    <View>
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

const HeaderConfig = {
  header: ({ scene }: CustomHeaderBarProps) => <CustomHeaderBar scene={scene} />,
};

export { TranslucentStatusBar, HeaderConfig, CustomHeaderBar };
