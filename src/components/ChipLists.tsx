/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  View,
  Platform,
  Animated,
  TextInput,
  FlatList,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import color from 'color';

import { PlatformTouchable } from './PlatformComponents';

type ChipBaseProps = {
  children: React.ReactNode;
  icon?: string;
  onPress?: () => void;
  selected?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  rightAction?: boolean;
  color?: string;
};

const ChipBase: React.FC<ChipBaseProps> = ({
  children,
  icon,
  onPress,
  selected = false,
  containerStyle,
  rightAction = false,
  color: borderColor,
}) => {
  const elevation = new Animated.Value(0);

  const handlePressIn = () => {
    Animated.timing(elevation, {
      toValue: 4,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(elevation, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  if (!selected) handlePressOut();

  const { colors } = useTheme();
  const selectedBackground = color(colors.primary).mix(color(colors.background), 0.85).string();

  return (
    <Animated.View
      style={[
        {
          elevation: Platform.OS === 'android' ? elevation : 0,
          backgroundColor: selected ? selectedBackground : colors.background,
          overflow: 'hidden',
          height: 40,
          borderRadius: 20,
          borderWidth: 0.5,
          borderColor: borderColor || (selected ? colors.primary : colors.disabled),
          alignItems: 'center',
        },
        containerStyle,
      ]}
    >
      <TouchableOpacity
        disabled={!onPress || rightAction}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 8,
            paddingRight: rightAction ? 0 : 10,
          }}
        >
          {!rightAction && icon && <Icon name={icon} size={20} color={colors.icon} />}
          {children}
          {rightAction && icon && (
            <IconButton
              icon={icon}
              color={colors.softContrast}
              size={20}
              onPress={onPress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

type TextChipProps = {
  title: string;
};

const TextChip: React.FC<TextChipProps> = ({ title, ...rest }) => {
  return (
    <ChipBase {...rest}>
      <Text style={{ paddingLeft: 6, fontSize: 15 }}>{title}</Text>
    </ChipBase>
  );
};

type TextInputChipProps = {
  onSubmit: (tagText: string) => void;
  endInput: () => void;
  placeholder?: string;
};

const TextInputChip: React.FC<TextInputChipProps> = ({
  onSubmit,
  endInput,
  placeholder,
  ...rest
}) => {
  const textInputRef = React.useRef<TextInput>(null);
  const [tagText, setTagText] = React.useState('');

  const onFinish = () => {
    if (tagText === '') {
      endInput();
    } else {
      onSubmit(tagText);
      endInput();
    }
  };

  return (
    <ChipBase {...rest}>
      <TextInput
        ref={textInputRef}
        style={{ fontSize: 15, paddingVertical: 3 }}
        autoFocus
        blurOnSubmit
        placeholder={placeholder}
        autoCapitalize="none"
        value={tagText}
        onChangeText={setTagText}
        onSubmitEditing={onFinish}
        onEndEditing={onFinish}
        onBlur={onFinish} // Debatable
      />
    </ChipBase>
  );
};

type ListItem = {
  key: string;
  title: string;
  icon?: string;
  [key: string]: any;
};

type CategoriesListProps = {
  categories: ListItem[];
  selected: string;
  setSelected: (key: any) => void;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  chipProps?: object;
};

const CategoriesList: React.FC<CategoriesListProps> = ({
  categories,
  selected,
  setSelected,
  style,
  containerStyle,
  chipProps = {},
}) => {
  return (
    <FlatList
      style={[{ paddingVertical: 5 }, containerStyle]}
      horizontal
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={false}
      data={categories}
      keyExtractor={(cat) => cat.key}
      renderItem={({ item, index }) => (
        <TextChip
          icon={item.icon}
          title={item.title}
          selected={item.key === selected}
          onPress={() => setSelected(item.key)}
          containerStyle={[
            {
              marginLeft: index === 0 ? 15 : 5,
              marginRight: index === categories.length - 1 ? 15 : 5,
              marginVertical: 5,
            },
            style,
          ]}
          {...chipProps}
        />
      )}
    />
  );
};

type ChipAddListProps = {
  data?: ListItem[];
  keyList?: string[];
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  setList: (item: ListItem) => void;
  chipProps?: object;
};

const ChipAddList: React.FC<ChipAddListProps> = ({
  data = [],
  keyList = [],
  setList,
  style,
  containerStyle,
  chipProps = {},
}) => {
  const sortedData = [
    // Bring selected items to the front
    ...data.filter((item) => keyList.includes(item?.key)),
    ...data.filter((item) => !keyList.includes(item?.key)),
  ];

  return (
    <FlatList
      style={[{ paddingVertical: 5 }, containerStyle]}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      data={sortedData}
      keyExtractor={(item) => item?.key}
      renderItem={({ item, index }) => {
        return (
          <TextChip
            icon={item.icon}
            title={item.title}
            selected={keyList.includes(item?.key)}
            onPress={() => setList(item)}
            containerStyle={[
              {
                marginLeft: index === 0 ? 15 : 5,
                marginRight: index === data.length - 1 ? 15 : 5,
                marginVertical: 5,
              },
              style,
            ]}
            {...chipProps}
          />
        );
      }}
    />
  );
};

type ChipSuggestionListProps = {
  data?: ListItem[];
  setList: (item: any) => void;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

const ChipSuggestionList: React.FC<ChipSuggestionListProps> = ({
  data = [],
  setList,
  style,
  containerStyle,
}) => {
  return (
    <FlatList
      style={[{ paddingVertical: 5 }, containerStyle]}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      data={data}
      keyExtractor={(item) => item.key}
      renderItem={({ item, index }) => {
        return (
          <TextChip
            icon={item.icon}
            title={item.title}
            color={item.color}
            onPress={() => setList(item)}
            containerStyle={[
              {
                marginLeft: index === 0 ? 15 : 5,
                marginRight: index === data.length - 1 ? 15 : 5,
                marginVertical: 5,
              },
              style,
            ]}
          />
        );
      }}
    />
  );
};

export { CategoriesList, ChipAddList, ChipSuggestionList, ChipBase, TextChip };
