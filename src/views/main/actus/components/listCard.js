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

export default class ActuComponentListCard extends React.Component {
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

  genTagData = (article) => { // TODO: Messy code
    let data = [];
    data.push({
      type: 'group',
      avatar: article.group.thumbnailUrl || '',
      icon: 'newspaper', // Just in case thumbnail url is undefined
      text: article.group.displayName,
      id: article.group.groupId,
    });
    for (tag in article.tags) {
      if (Object.prototype.hasOwnProperty.call(article.tags, tag)) {
        data.push({
          type: 'tag',
          text: article.tags[tag].name,
          color: article.tags[tag].color,
          id: article.tags[tag].tagId,
        });
      }
    }
    data.push({
      type: 'author',
      icon: 'account',
      text: article.author.displayName,
      id: article.author.userId,
    });
    if (article.location.global) {
      data.push({
        type: 'global',
        icon: 'map-marker',
        text: 'France',
        id: '',
      });
    }
    for (school in article.location.schools) {
      if (Object.prototype.hasOwnProperty.call(article.location.schools, school)) {
        data.push({
          type: 'school',
          icon: 'map-marker',
          text: article.location.schools[school].displayName,
          id: article.location.schools[school].schoolId,
        })
      }
    }
    for (department in article.location.departments) {
      if (Object.prototype.hasOwnProperty.call(article.location.departments, department)) {
        data.push({
          type: 'department',
          icon: 'map-marker',
          text: article.location.departments[department].displayName,
          id: article.location.departments[department].displayName,
        })
      }
    }
    return data;
  }

  render() {
    const { article, navigate } = this.props;

    const data = this.genTagData(article);

    const Touchable = Platform.OS === 'ios'
      ? TouchableOpacity
      : TouchableNativeFeedback;

    return (
      <View style={styles.container}>
        <Card
          style={styles.card}
        >
          <Card.Content>
            <Touchable
              onPress={() => navigate()}
            >
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={{ uri: article.thumbnailUrl }}
                  style={[styles.thumbnail, {
                    width: 120,
                    height: 120,
                  }]}
                />
                <View style={{
                  margin: 10,
                  marginTop: 0,
                  marginLeft: 15,
                  flex: 1,
                }}
                >
                  <Text style={styles.cardTitle}>{article.title}</Text>
                  <Paragraph style={styles.text}>{article.description}</Paragraph>
                </View>
              </View>
            </Touchable>
          </Card.Content>
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

ActuComponentListCard.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string,
    description: PropTypes.string,
    content: PropTypes.shape({
      parser: PropTypes.string.isRequired,
      data: PropTypes.string.isRequired,
    }).isRequired,

  }).isRequired,
  navigate: PropTypes.func.isRequired,
};
