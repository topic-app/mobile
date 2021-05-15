import { useNavigation } from '@react-navigation/core';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import React from 'react';
import { StatusBar, View, StatusBarProps, ViewStyle, StyleProp, Platform } from 'react-native';
import { Appbar, Menu, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import shortid from 'shortid';

import getStyles from '@styles/navigators';
import { useLayout } from '@utils';

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
  label: string;
  onPress: () => void;
};

export type HeaderBarProps = {
  title: string;
  subtitle?: string;
  headerStyle?: StyleProp<ViewStyle>;
  primary?: () => void;
  home?: boolean;
  actions?: ActionItem[];
  overflow?: OverflowItem[];
  hideBack?: boolean;
};

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  subtitle,
  headerStyle,
  primary,
  home,
  actions = [],
  overflow,
  hideBack,
}) => {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const layout = useLayout();

  let primaryAction;
  if (primary) {
    primaryAction = <Appbar.BackAction onPress={primary} />;
  } else if (layout === 'desktop') {
    primaryAction = null;
  } else if (home) {
    primaryAction = (
      <Appbar.Action
        icon="menu"
        onPress={navigation.openDrawer}
        accessibilityLabel="Menu principal"
      />
    );
  } else if (hideBack || Platform.OS === 'web') {
    primaryAction = <View />;
  } else {
    primaryAction = <Appbar.BackAction onPress={navigation.goBack} accessibilityLabel="Retour" />;
  }

  const secondaryActions = actions.map((item) => (
    <Appbar.Action
      key={shortid()}
      icon={item.icon}
      onPress={item.onPress}
      accessibilityLabel={item.label}
    />
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
          accessibilityLabel="Options supplémentaires"
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
      <Appbar.Header style={[styles.header, headerStyle]} statusBarHeight={insets.top}>
        {primaryAction}
        <Appbar.Content title={title} subtitle={subtitle} />
        {secondaryActions}
        {overflowAction}
      </Appbar.Header>
    </View>
  );
};

export { TranslucentStatusBar, HeaderBar };
