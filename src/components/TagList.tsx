import React from 'react';
import { FlatList, View } from 'react-native';
import { Chip } from 'react-native-paper';

import getStyles from '@styles/Styles';
import { useTheme, genTagListData, ItemData } from '@utils';

import Avatar from './Avatar';

type Props = {
  item: ItemData;
  scrollable: boolean;
};

const TagList: React.FC<Props> = ({ item, scrollable }) => {
  const data = genTagListData(item);

  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  return (
    <View onStartShouldSetResponder={() => true}>
      <FlatList
        style={{ paddingVertical: 7 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        scrollEnabled={scrollable}
        keyExtractor={(tag) => tag.type + tag.key}
        renderItem={({ item: tag, index: tagIndex }) => (
          <View
            style={{
              marginLeft: tagIndex === 0 ? 15 : 5,
              marginRight: tagIndex === data.length - 1 ? 15 : 5,
            }}
          >
            <Chip
              mode="outlined"
              icon={tag.image || tag.avatar ? undefined : tag.icon}
              avatar={
                tag.image || tag.avatar ? (
                  <Avatar size={24} imageUrl={tag.image} avatar={tag.avatar} />
                ) : undefined
              }
              style={[
                styles.tag,
                {
                  borderColor: tag.color || colors.disabled,
                },
              ]}
              textStyle={styles.tagContent}
            >
              {tag.label}
            </Chip>
          </View>
        )}
      />
    </View>
  );
};

export default TagList;
