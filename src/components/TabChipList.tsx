import React from 'react';
import { View, SectionList } from 'react-native';
import { IconButton } from 'react-native-paper';

import { useTheme } from '@utils/index';

import { TextChip } from './ChipLists';

type ListItem = {
  key: string;
  data: {
    key: string;
    title: string;
    icon?: string;
  }[];
};

type TabChipListProps<T extends ListItem> = {
  sections: T[];
  selected: string;
  setSelected: (key: string) => void;
  configure?: () => void;
};

const TabChipList = <T extends ListItem>({
  sections,
  selected,
  setSelected,
  configure,
}: TabChipListProps<T>): React.ReactElement => {
  const theme = useTheme();
  const { colors } = theme;
  return (
    <View>
      <SectionList
        style={{ paddingTop: 13, paddingBottom: 8 }}
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
            }}
          />
        )}
        ListFooterComponent={
          configure
            ? () => (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <IconButton
                    icon="pencil"
                    size={26}
                    style={{ marginLeft: 5, margin: 0 }}
                    color={colors.icon}
                    onPress={configure}
                  />
                </View>
              )
            : null
        }
      />
    </View>
  );
};

export default TabChipList;
