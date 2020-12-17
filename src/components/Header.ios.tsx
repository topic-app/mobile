import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StatusBar, View, StatusBarProps, ViewStyle, StyleProp, Dimensions } from 'react-native';
import { Appbar, Text, Menu } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import shortid from 'shortid';

import { PlatformTouchable } from '@components/index';
import getNavigatorStyles from '@styles/NavStyles';
import { useTheme, useSafeAreaInsets } from '@utils/index';

const TranslucentStatusBar: React.FC<StatusBarProps> = ({ barStyle, ...rest }) => {
  const theme = useTheme();
  const { colors } = theme;
  const contentTheme = barStyle || theme.statusBarStyle;
  return (
    <StatusBar translucent backgroundColor={colors.statusBar} barStyle={contentTheme} {...rest} />
  );
};

type BackButtonProps = {
  onPress: () => void;
  previous?: string;
};

const BackButton: React.FC<BackButtonProps> = ({ onPress, previous }) => {
  const theme = useTheme();
  const backColor = theme.colors.primary;
  return (
    <View>
      <TranslucentStatusBar />
      <PlatformTouchable onPress={onPress}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons
            name="ios-arrow-back"
            size={30}
            style={{ paddingTop: 2, paddingLeft: 7 }}
            color={backColor}
          />
          <Text style={{ fontSize: 16, paddingLeft: 5, color: backColor }}>
            {previous ?? 'Retour'}
          </Text>
        </View>
      </PlatformTouchable>
    </View>
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
        iosLeftAction?: {
          title: string;
          onPress: () => void;
        };
        home?: boolean;
        actions?: ActionItem[];
        overflow?: OverflowItem[];
      };
    };
  };
  navigation: NavigationProp<any, any>;
};

const CustomHeaderBar: React.FC<CustomHeaderBarProps> = ({ scene }) => {
  const theme = useTheme();
  const { colors } = theme;
  const navigatorStyles = getNavigatorStyles(theme);

  const navigation = useNavigation();

  const {
    title,
    subtitle,
    headerStyle,
    primary,
    iosLeftAction,
    home,
    actions,
    overflow,
  } = scene.descriptor.options;

  let primaryAction;
  if (primary) {
    primaryAction = <BackButton onPress={primary} previous={subtitle} />;
  } else if (home) {
    primaryAction = !iosLeftAction ? null : (
      <PlatformTouchable onPress={iosLeftAction.onPress}>
        <Text style={{ fontSize: 20, paddingLeft: 16, color: colors.primary }}>
          {iosLeftAction.title}
        </Text>
      </PlatformTouchable>
    );
  } else {
    primaryAction = <BackButton onPress={navigation?.goBack} previous={subtitle} />;
  }

  const [menuVisible, setMenuVisible] = React.useState(false);

  const secondaryActions = actions?.map((item) => (
    <Appbar.Action key={shortid()} icon={item.icon} onPress={item.onPress} color={colors.primary} />
  ));

  const overflowAction = overflow && (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={
        <Appbar.Action
          icon="dots-vertical"
          onPress={() => setMenuVisible(true)}
          color={colors.primary}
        />
      }
      statusBarHeight={StatusBar.currentHeight}
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

  const insets = useSafeAreaInsets();

  return (
    <View>
      <TranslucentStatusBar />
      <Appbar.Header statusBarHeight={insets.top} style={[navigatorStyles.header, headerStyle]}>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <View style={{ maxWidth: Math.floor(Dimensions.get('window').width * 0.6) }}>
            <Appbar.Content
              title={title}
              titleStyle={{ fontFamily: 'Rubik-Medium', color: colors.text, fontSize: 24 }}
            />
          </View>
        </View>
        <View style={{ position: 'absolute' }}>{primaryAction}</View>
        <View style={{ position: 'absolute', right: 0, flexDirection: 'row' }}>
          {secondaryActions}
          {overflowAction}
        </View>
      </Appbar.Header>
    </View>
  );
};

export { TranslucentStatusBar, CustomHeaderBar };
