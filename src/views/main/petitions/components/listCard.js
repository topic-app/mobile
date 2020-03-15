import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import {
  Card,
  Avatar,
  Chip,
  Paragraph,
} from 'react-native-paper';

import { styles, colors } from '../../../../styles/Styles';

export default class PetitionComponentListCard extends React.Component {
  genTagIcon = (type) => {
    if (type === 'tag') {
      return 'tag';
    } if (type === 'author') {
      return 'account';
    } if (type === 'group') {
      return 'newspaper';
    } if (type === 'location') {
      return 'map-marker';
    }
    return '';
  }

  genTagData = (petition) => { // TODO: Messy code
    const data = [];
    if (petition.publisher.type === 'group') {
      data.push({
        type: 'group',
        avatar: petition.publisher.group.thumbnailUrl || '',
        icon: 'newspaper', // Just in case thumbnail url is undefined
        text: petition.publisher.group.displayName,
        id: petition.publisher.group.groupId,
      });
    } else if (petition.publisher.type === 'user') {
      data.push({
        type: 'author',
        icon: 'account',
        text: petition.publisher.user.displayName,
        id: petition.publisher.user.userId,
      });
    }

    data.concat(petition.tags.map((tag) => ({
      type: 'tag',
      text: tag.name,
      color: tag.color,
      id: tag.tagId,
    })));

    if (petition.location.global) {
      data.push({
        type: 'global',
        icon: 'map-marker',
        text: 'France',
        id: '',
      });
    }

    data.concat(petition.location.schools.map((school) => ({
      type: 'school',
      icon: 'map-marker',
      text: school.displayName,
      id: school.schoolId,
    })));

    data.concat(petition.location.departments.map((department) => ({
      type: 'department',
      icon: 'map-marker',
      text: department.displayName,
      id: department.departmentId,
    })));

    return data;
  }

  render() {
    const { petition, navigate } = this.props;

    const data = this.genTagData(petition);

    const Touchable = Platform.OS === 'ios'
      ? TouchableOpacity
      : TouchableNativeFeedback;

    return (
      <View style={styles.container}>
        <Card
          style={styles.card}
        >
          <Card.Content style={{ paddingTop: 5, paddingLeft: 0, paddingRight: 0 }}>
            <View style={{ marginTop: 10 }}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={data} // TODO: Use location, group author instead of tags
                keyExtractor={(tag) => tag.type + tag.id}
                renderItem={({ item: tag, index: tagIndex }) => (
                  <View style={{
                    marginLeft: tagIndex === 0 ? 15 : 5,
                    marginRight: tagIndex === data.length - 1 ? 15 : 5,
                  }}
                  >
                    <Chip
                      mode="outlined"
                      icon={tag.avatar ? '' : tag.icon}
                      // TODO: Changer la couleur de l'icone
                      avatar={tag.avatar ? (<Avatar.Image size={24} source={{ uri: tag.avatar }} />) : ''}
                      style={[styles.tag, {
                        borderColor: tag.color || colors.disabled,
                      }]}
                      textStyle={styles.text}
                    >
                      {tag.text}
                    </Chip>
                  </View>
                )}
              />
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  }
}

PetitionComponentListCard.propTypes = {
  petition: PropTypes.shape({
    title: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    description: PropTypes.string,
    content: PropTypes.shape({
      parser: PropTypes.string.isRequired,
      data: PropTypes.string.isRequired,
    }).isRequired,

  }).isRequired,
  navigate: PropTypes.func.isRequired,
};
