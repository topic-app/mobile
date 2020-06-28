import React from 'react';
import { StatusBar, View, TouchableOpacity, StatusBarProps, ViewStyle } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme, Appbar, Text } from 'react-native-paper';
import { NavigationProp } from '@react-navigation/native';

import getNavigatorStyles from '@styles/NavStyles';

const TranslucentStatusBar: React.FC<StatusBarProps> = ({ barStyle, ...rest }) => {
  const theme = useTheme();
  const { colors } = theme;
  const contentTheme = barStyle || theme.statusBarStyle;
  return (
    <StatusBar
      translucent
      backgroundColor={colors.statusBar}
      barStyle={contentTheme}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    />
  );
};

type BackButtonProps = {
  onPress: () => void;
  previous: string;
};

const BackButton: React.FC<BackButtonProps> = ({ onPress, previous }) => {
  const theme = useTheme();
  const backColor = theme.dark ? '#0a84ff' : '#0a7aff';
  return (
    <View>
      <TranslucentStatusBar />
      <TouchableOpacity onPress={onPress}>
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
      </TouchableOpacity>
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
        headerStyle?: ViewStyle;
        primary?: () => void;
        home?: boolean;
        actions?: ActionItem[];
        overflow?: OverflowItem[];
      };
    };
  };
  navigation: NavigationProp<any, any>;
};

const CustomHeaderBar: React.FC<CustomHeaderBarProps> = ({ scene, navigation }) => {
  const theme = useTheme();
  const navigatorStyles = getNavigatorStyles(theme);

  const { title, subtitle, headerStyle, primary, home } = scene.descriptor.options;

  let primaryAction;
  if (primary) {
    primaryAction = <BackButton onPress={primary} />;
  } else if (home) {
    primaryAction = null;
  } else {
    primaryAction = <BackButton onPress={navigation.goBack} />;
  }

  const insets = useSafeArea();

  return (
    <View style={navigatorStyles.headerSurface}>
      <TranslucentStatusBar />
      <Appbar.Header statusBarHeight={insets.top} style={[navigatorStyles.header, headerStyle]}>
        {primaryAction}
        <Appbar.Content title={title} subtitle={subtitle} />
      </Appbar.Header>
    </View>
  );
};

const HeaderConfig = {
  header: ({ scene, navigation }: CustomHeaderBarProps) => (
    <CustomHeaderBar scene={scene} navigation={navigation} />
  ),
};

export { TranslucentStatusBar, HeaderConfig, CustomHeaderBar };
