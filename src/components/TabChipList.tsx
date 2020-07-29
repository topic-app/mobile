/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { View, SectionList } from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';

import { PlatformTouchable } from './PlatformComponents';

import { TextChip } from './ChipLists';

type ListItem = {
  key: string;
  title?: string;
  icon?: string;
  data: {
    key: string;
    title?: string;
  }[];
};

type TabChipListProps = {
  sections: ListItem[];
  selected: string;
  setSelected: (key: string) => void;
  configure?: () => void;
};

const TabChipList: React.FC<TabChipListProps> = ({
  sections,
  selected,
  setSelected,
  configure,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  return (
    <View>
      <SectionList
        style={{ paddingVertical: 5 }}
        horizontal
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        sections={sections}
        keyExtractor={(cat) => cat.key}
        renderItem={({ item, index }) => (
          <TextChip
            icon={item.icon}
            title={item.title}
            selected={item.key === selected}
            onPress={() => setSelected(item.key)}
            containerStyle={{
              marginLeft: index === 0 ? 15 : 5,
              marginRight: index === sections.length - 1 ? 15 : 5,
              marginVertical: 5,
            }}
          />
        )}
        ListFooterComponent={() =>
          configure ? (
            <View
              style={{
                marginLeft: 5,
                marginVertical: 5,
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <IconButton icon="pencil" size={20} color={colors.disabled} onPress={configure} />
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default TabChipList;
