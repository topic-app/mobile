import React from 'react';
import PropTypes from 'prop-types';
import {
  Chip,
  Avatar,
} from 'react-native-paper';
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';

import articles from '../data/testDataList.json';

import { styles, colors } from '../../../../styles/Styles';

export default class ActuDisplayScreen extends React.Component {
  static navigationOptions = {
    title: 'Actus et évènements',
  };

  genTagData = (article) => { // TODO: Messy code
    const data = [];
    data.push({
      type: 'group',
      avatar: article.group.thumbnailUrl || '',
      icon: 'newspaper', // Just in case thumbnail url is undefined
      text: article.group.displayName,
      id: article.group.groupId,
    });
    data.push({
      type: 'author',
      icon: 'account',
      text: article.author.displayName,
      id: article.author.userId,
    });
    data.concat(article.tags.map((tag) => ({
      type: 'tag',
      text: tag.name,
      color: tag.color,
      id: tag.tagId,
    })));
    if (article.location.global) {
      data.push({
        type: 'global',
        icon: 'map-marker',
        text: 'France',
        id: '',
      });
    }
    data.concat(article.location.schools.map((school) => ({
      type: 'school',
      icon: 'map-marker',
      text: school.displayName,
      id: school.schoolId,
    })));
    data.concat(article.location.departments.map((department) => ({
      type: 'department',
      icon: 'map-marker',
      text: department.displayName,
      id: department.departmentId,
    })));
    return data;
  }

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

  render() {
    const { navigation } = this.props;
    const { state } = navigation;
    const { id } = state.params;
    const article = articles[id - 1];

    const data = this.genTagData(article);

    return (
      <View style={styles.page}>
        <ScrollView>
          <Image
            source={{ uri: article.thumbnailUrl }}
            style={[styles.image, { height: 250 }]}
          />
          <View style={styles.contentContainer}>
            <Text style={styles.title}>
              {article.title}
            </Text>
            <Text style={styles.subtitle}>
              {article.time}
              {' '}
              par
              {' '}
              {article.group.displayName}
            </Text>
          </View>
          <View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={data}
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
          <View style={styles.contentContainer}>
            <Text style={styles.text}>
              {article.content.data}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

ActuDisplayScreen.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};