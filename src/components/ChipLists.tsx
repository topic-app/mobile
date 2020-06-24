/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
  Animated,
  TextInput,
  FlatList,
  ViewPropTypes,
} from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import color from 'color';

function ChipBase({ children, icon, onPress, selected, containerStyle, rightAction }) {
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
  const Touchable = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;
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
          borderColor: selected ? colors.primary : colors.disabled,
        },
        containerStyle,
      ]}
    >
      <Touchable
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
      </Touchable>
    </Animated.View>
  );
}

function TextChip({ title, ...rest }) {
  return (
    <ChipBase {...rest}>
      <Text style={{ paddingLeft: 6, fontSize: 15 }}>{title}</Text>
    </ChipBase>
  );
}

function TextInputChip({ onSubmit, endInput, placeholder, ...rest }) {
  const textInputRef = React.createRef();
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
}

function CategoriesList({ categories, selected, setSelected, style, containerStyle }) {
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
        />
      )}
    />
  );
}

function ChipAddList({ data, keyList, setList, style, containerStyle }) {
  const sortedData = [
    // Bring selected items to the front
    ...data.filter((item) => keyList.includes(item.key)),
    ...data.filter((item) => !keyList.includes(item.key)),
  ];

  return (
    <FlatList
      style={[{ paddingVertical: 5 }, containerStyle]}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      data={sortedData}
      keyExtractor={(item) => item.key}
      renderItem={({ item, index }) => {
        return (
          <TextChip
            icon={item.icon}
            title={item.title}
            selected={keyList.includes(item.key)}
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
}

function ChipSuggestionList({ data, setList, style, containerStyle }) {
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
}

export { CategoriesList, ChipAddList, ChipSuggestionList };

ChipBase.defaultProps = {
  children: null,
  containerStyle: null,
  selected: false,
  rightAction: false,
  onPress: null,
  icon: null,
};

ChipBase.propTypes = {
  children: PropTypes.node,
  selected: PropTypes.bool,
  rightAction: PropTypes.bool,
  icon: PropTypes.string,
  onPress: PropTypes.func,
  containerStyle: ViewPropTypes.style,
};

TextChip.defaultProps = {
  containerStyle: null,
  selected: false,
  icon: null,
  onPress: null,
};

TextChip.propTypes = {
  title: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  icon: PropTypes.string,
  onPress: PropTypes.func,
  containerStyle: ViewPropTypes.style,
};

TextInputChip.defaultProps = {
  containerStyle: null,
  icon: null,
};

TextInputChip.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  endInput: PropTypes.func.isRequired,
  icon: PropTypes.string,
  containerStyle: ViewPropTypes.style,
  placeholder: PropTypes.string.isRequired,
};

CategoriesList.defaultProps = {
  style: null,
  containerStyle: null,
};

CategoriesList.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    }),
  ).isRequired,
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.func.isRequired,
  containerStyle: ViewPropTypes.style,
  style: ViewPropTypes.style,
};

ChipAddList.defaultProps = {
  keyList: [],
  data: [],
  style: null,
  containerStyle: null,
};

ChipAddList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ),
  keyList: PropTypes.arrayOf(PropTypes.string),
  setList: PropTypes.func.isRequired,
  containerStyle: ViewPropTypes.style,
  style: ViewPropTypes.style,
};

ChipSuggestionList.defaultProps = {
  data: [],
  style: null,
  containerStyle: null,
};

ChipSuggestionList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ),
  setList: PropTypes.func.isRequired,
  containerStyle: ViewPropTypes.style,
  style: ViewPropTypes.style,
};

ChipSuggestionList.defaultProps = {
  data: [],
  style: null,
  containerStyle: null,
};

ChipSuggestionList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ),
  setList: PropTypes.func.isRequired,
  containerStyle: ViewPropTypes.style,
  style: ViewPropTypes.style,
};
