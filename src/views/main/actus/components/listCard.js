import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  FlatList,
  Text,
  Image,
} from 'react-native';
import {
  Card,
  Avatar,
  Chip,
  Paragraph,
} from 'react-native-paper';

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
    const { article } = this.props;
    return (
      <View style={{ marginTop: 10, marginLeft: 10, marginRight: 10 }}>
        <Card
          style={{
            borderWidth: 0.7,
            borderColor: 'lightgray',
            elevation: 0,
          }}
        >

          <Card.Content style={{ flexDirection: 'row' }}>
            <Image
              source={{ uri: article.thumbnailUrl }}
              style={{
                width: 120,
                height: 120,
                backgroundColor: 'lightgray',
                flex: 0,
              }}
            />
            <View style={{
              margin: 10,
              marginTop: 0,
              marginLeft: 15,
              flex: 1,
            }}
            >
              <Text style={{ fontSize: 25, fontWeight: '400', marginBottom: 5 }}>{article.title}</Text>
              <Paragraph>{article.description}</Paragraph>
            </View>
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
                      avatar={tag.avatar ? (<Avatar.Image size={24} source={{ uri: tag.avatar }} />) : ''}
                      style={{ borderColor: tag.color || 'gray' }}
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
