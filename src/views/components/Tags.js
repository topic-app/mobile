import React from 'react';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';
import { Chip, Avatar } from 'react-native-paper';

import { styles, colors } from '../../styles/Styles';

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
          avatar: group.thumbnailUrl || '',
          icon: 'newspaper',
          text: group.displayName,
          id: group.groupId,
        });
      } else if (voteType === 'user') {
        data.push({
          type: 'author',
          icon: 'account',
          text: user.displayName,
          id: user.userId,
        });
      }
    }
  } else {
    if (item.author) {
      data.push({
        type: 'author',
        icon: 'account',
        text: item.author.displayName,
        id: item.author.userId,
      });
    }
    if (item.group) {
      data.push({
        type: 'group',
        avatar: item.group.thumbnailUrl || '',
        icon: 'newspaper', // Just in case thumbnail url is undefined
        text: item.group.displayName,
        id: item.group.groupId,
      });
    }
  }

  if (item.tags) {
    data.push(
      ...item.tags.map((tag) => ({
        type: 'tag',
        text: tag.name,
        color: tag.color,
        id: tag.tagId,
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
        icon: 'map-marker',
        text: school.displayName,
        id: school.schoolId,
      })),
    );

    data.push(
      ...item.location.departments.map((department) => ({
        type: 'department',
        icon: 'map-marker',
        text: department.displayName,
        id: department.departmentId,
      })),
    );
  }

  return data;
}

function TagFlatlist({ item, type }) {
  const data = genTagData(item, type);

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

TagFlatlist.propTypes = {
  type: PropTypes.string.isRequired,
  item: PropTypes.shape({
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        tagId: PropTypes.string.isRequired,
      }),
    ).isRequired,
    location: PropTypes.shape({
      global: PropTypes.bool.isRequired,
      schools: PropTypes.arrayOf(
        PropTypes.shape({
          schoolId: PropTypes.string.isRequired,
          displayName: PropTypes.string.isRequired,
        }),
      ).isRequired,
      departments: PropTypes.arrayOf(
        PropTypes.shape({
          departmentId: PropTypes.string.isRequired,
          displayName: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }).isRequired,
    author: PropTypes.shape({
      userId: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    }),
    publisher: PropTypes.shape({
      type: PropTypes.string,
      user: PropTypes.shape({
        userId: PropTypes.string,
        displayName: PropTypes.string,
      }),
      group: PropTypes.shape({
        groupId: PropTypes.string,
        displayName: PropTypes.string,
        thumbnailUrl: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default TagFlatlist;
