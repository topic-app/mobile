import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StatusBar, View, StatusBarProps, ViewStyle, StyleProp, Dimensions } from 'react-native';
import { Appbar, Text, Menu, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import shortid from 'shortid';

import { PlatformTouchable } from '@components';
import getStyles from '@styles/navigators';

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
  accessibilityLabel?: string;
};

const BackButton: React.FC<BackButtonProps> = ({ onPress, previous, accessibilityLabel }) => {
  const theme = useTheme();
  const backColor = theme.colors.appBarButton;
  return (
    <View>
      <TranslucentStatusBar />
      <PlatformTouchable onPress={onPress} accessibilityLabel={accessibilityLabel}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Icon name="chevron-left" size={34} style={{ paddingTop: 2 }} color={backColor} />
          <Text style={{ fontSize: 18, marginLeft: -5, color: backColor }}>
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
  label: string;
  onPress: () => void;
};

export type HeaderBarProps = {
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

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  subtitle,
  headerStyle,
  primary,
  iosLeftAction,
  home,
  actions = [],
  overflow,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  const navigation = useNavigation();

  let primaryAction;
  if (home && !primary) {
    primaryAction = !iosLeftAction ? null : (
      <PlatformTouchable onPress={iosLeftAction.onPress}>
        <Text style={{ fontSize: 20, paddingLeft: 16, color: colors.appBarButton }}>
          {iosLeftAction.title}
        </Text>
      </PlatformTouchable>
    );
  } else {
    primaryAction = (
      <BackButton
        onPress={navigation?.goBack}
        previous={subtitle}
        accessibilityLabel={subtitle ? `Retour ${subtitle}` : 'Retour'}
      />
    );
  }

  const [menuVisible, setMenuVisible] = React.useState(false);

  const secondaryActions = actions.map((item) => (
    <Appbar.Action
      key={shortid()}
      icon={item.icon}
      onPress={item.onPress}
      color={colors.appBarButton}
      accessibilityLabel={item.label}
    />
  ));

  const overflowAction = overflow && (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={
        <Appbar.Action
          icon="dots-vertical"
          onPress={() => setMenuVisible(true)}
          color={colors.appBarButton}
          accessibilityLabel="Options suppl??mentaires"
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
      <Appbar.Header statusBarHeight={insets.top} style={[styles.header, headerStyle]}>
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
              titleStyle={{ fontFamily: 'Rubik', color: colors.appBarText, fontSize: 24 }}
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

export { TranslucentStatusBar, HeaderBar };
