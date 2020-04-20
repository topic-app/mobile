import React from 'react';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';
import { Chip, Avatar, withTheme } from 'react-native-paper';

import getStyles from '../styles/Styles';

function genTagIcon(type) {
  if (type === 'tag') {
    return 'tag';
  }
  if (type === 'author') {
    return 'account';
  }
  if (type === 'group') {
    return 'newspaper';
  }
  if (type === 'location') {
    return 'map-marker';
  }
  return '';
}

function genTagData(item, type) {
  // TEMP: if to check for undefineds
  const data = [];

  if (type === 'petition') {
    if (item.publisher) {
      const { type: voteType, user, group } = item.publisher;
      if (voteType === 'group') {
        data.push({
          type: 'group',
          id: group._id,
          avatar: group.thumbnailUrl || '',
          icon: 'newspaper',
          text: group.displayName,
        });
      } else if (voteType === 'user') {
        data.push({
          type: 'author',
          id: user._id,
          icon: 'account',
          text: user.displayName,
        });
      }
    }
  } else {
    if (item.author) {
      data.push({
        type: 'author',
        id: item.author._id,
        icon: 'account',
        text: item.author.displayName,
      });
    }
    if (item.group) {
      data.push({
        type: 'group',
        id: item.group._id,
        avatar: item.group.thumbnailUrl || '',
        icon: 'newspaper', // Just in case thumbnail url is undefined
        text: item.group.displayName,
      });
    }
  }

  if (item.tags) {
    data.push(
      ...item.tags.map((tag) => ({
        type: 'tag',
        id: tag._id,
        icon: 'pound',
        text: tag.displayName,
        color: tag.color,
      })),
    );
  }

  if (item.location) {
    if (item.location.global) {
      data.push({
        type: 'global',
        icon: 'map-marker',
        text: 'France',
        id: '',
      });
    }

    data.push(
      ...item.location.schools.map((school) => ({
        type: 'school',
        id: school._id,
        icon: 'map-marker',
        text: school.displayName,
      })),
    );

    data.push(
      ...item.location.departments.map((department) => ({
        type: 'department',
        id: department._id,
        icon: 'map-marker',
        text: department.displayName,
      })),
    );
  }

  return data;
}

function TagList({ item, type, theme }) {
  const data = genTagData(item, type);

  const styles = getStyles(theme);
  const { colors } = theme;

  return (
    <FlatList
      style={{ paddingVertical: 7 }}
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data} // TODO: Use location, group author instead of tags
      keyExtractor={(tag) => tag.type + tag.id}
      renderItem={({ item: tag, index: tagIndex }) => (
        <View
          style={{
            marginLeft: tagIndex === 0 ? 15 : 5,
            marginRight: tagIndex === data.length - 1 ? 15 : 5,
          }}
        >
          <Chip
            mode="outlined"
            icon={tag.avatar ? '' : tag.icon}
            // TODO: Changer la couleur de l'icone
            avatar={tag.avatar ? <Avatar.Image size={24} source={{ uri: tag.avatar }} /> : ''}
            style={[
              styles.tag,
              {
                borderColor: tag.color || colors.disabled,
              },
            ]}
            textStyle={styles.tagContent}
          >
            {tag.text}
          </Chip>
        </View>
      )}
    />
  );
}

TagList.propTypes = {
  type: PropTypes.string.isRequired,
  item: PropTypes.shape({
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        _id: PropTypes.string.isRequired,
      }),
    ).isRequired,
    location: PropTypes.shape({
      global: PropTypes.bool.isRequired,
      schools: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          displayName: PropTypes.string.isRequired,
        }),
      ).isRequired,
      departments: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          displayName: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }).isRequired,
    author: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    }),
    publisher: PropTypes.shape({
      type: PropTypes.string,
      user: PropTypes.shape({
        _id: PropTypes.string,
        displayName: PropTypes.string,
      }),
      group: PropTypes.shape({
        _id: PropTypes.string,
        displayName: PropTypes.string,
        thumbnailUrl: PropTypes.string,
      }),
    }),
  }).isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      valid: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      disabled: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default withTheme(TagList);
