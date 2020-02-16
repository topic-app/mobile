import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableNativeFeedback,
} from 'react-native';
import {
  Card,
  Avatar,
  Chip,
  Paragraph,
} from 'react-native-paper';

import { styles, colors } from '../../../../styles/Styles';
import actusStyles from '../styles/Styles';

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

  render() {
    const { article, navigate } = this.props;
    return (
      <View style={styles.container}>
        <Card
          style={styles.card}
        >
          <Card.Content>
            <TouchableNativeFeedback
              onPress={() => navigate()}
            >
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={{ uri: article.thumbnailUrl }}
                  style={[styles.thumnail, {
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
                  <Text style={actusStyles.title}>{article.title}</Text>
                  <Paragraph style={styles.text}>{article.description}</Paragraph>
                </View>
              </View>
            </TouchableNativeFeedback>
          </Card.Content>
          <Card.Content style={{ paddingTop: 5, paddingLeft: 0, paddingRight: 0 }}>
            <View style={{ marginTop: 10 }}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={article.tags}
                renderItem={({ item: tag, index: tagIndex }) => (
                  <View style={{
                    marginLeft: tagIndex === 0 ? 15 : 5,
                    marginRight: tagIndex === article.tags.length - 1 ? 15 : 5,
                  }}
                  >
                    <Chip
                      mode="outlined"
                      icon={tag.avatar ? '' : this.genTagIcon(tag.type)}
                      // TODO: Changer la couleur de l'icone
                      avatar={tag.avatar ? (<Avatar.Image size={24} source={{ uri: tag.avatar }} />) : ''}
                      style={[styles.tag, {
                        borderColor: tag.color || colors.highlightOutline,
                      }]}
                      textStyle={styles.text}
                    >
                      {tag.title}
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
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        avatar: PropTypes.string,
        color: PropTypes.string,
      }),
    ),
  }).isRequired,
};
