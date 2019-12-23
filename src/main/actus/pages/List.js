import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, FlatList, TouchableNativeFeedback } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons'
import { Button, Card, Avatar, Chip, Title, Paragraph } from 'react-native-paper';

export default class ActuListScreen extends React.Component {
  static navigationOptions = {
    title: 'Actus et évènements',
  };

  genTagIcon(type) {
    let IconComponent = MaterialCommunityIcons;
    let iconName;
    if (type === 'tag') {
      return `tag`;
    } else if (type === 'author') {
      return `account`;
    } else if (type === 'group') {
      return `newspaper`;
    } else if (type === 'location') {
      return `map-marker`;
    }
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View>
        <FlatList
          data={[
            {
              title: 'Article 1',
              description: 'Cat sit like bread toilet paper attack claws fluff everywhere meow miao french ciao litterbox for run off table persian cat jump...',
              tags: [{title: 'Tag 1', color: 'red', type: 'tag', key: 'item1'}, {title: 'Tag 2', color: 'blue', type: 'tag', key: 'item2'}, {title: 'Tag 3', color: 'green', type: 'tag', key: 'item3'}, {title: 'Auteur', type: 'author', key: 'item4'}, {title: 'Groupe avec un nom très long', color: 'group', avatar: 'https://picsum.photos/600', key: 'item5'}, {title: 'Centre International de Valbonne', type: 'location', key: 'item6'}],
              thumbnailUrl: 'https://picsum.photos/700',
              key: 'article1'
            },
            {
              title: 'Article 2',
              description: 'Cat sit like bread toilet paper attack claws fluff everywhere meow miao french ciao litterbox for run off table persian cat jump...',
              tags: [{title: 'Tag 1', color: 'red', type: 'tag', key: 'item1'}, {title: 'Tag 2', color: 'blue', type: 'tag', key: 'item2'}, {title: 'Tag 3', color: 'green', type: 'tag', key: 'item3'}, {title: 'Auteur', type: 'author', key: 'item4'}, {title: 'Groupe avec un nom très long', color: 'group', avatar: 'https://picsum.photos/600', key: 'item5'}, {title: 'Centre International de Valbonne', type: 'location', key: 'item6'}],
              thumbnailUrl: 'https://picsum.photos/700',
              key: 'article2'
            },
            {
              title: 'Article 3',
              description: 'Cat sit like bread toilet paper attack claws fluff everywhere meow miao french ciao litterbox for run off table persian cat jump...',
              tags: [{title: 'Tag 1', color: 'red', type: 'tag', key: 'item1'}, {title: 'Tag 2', color: 'blue', type: 'tag', key: 'item2'}, {title: 'Tag 3', color: 'green', type: 'tag', key: 'item3'}, {title: 'Auteur', type: 'author', key: 'item4'}, {title: 'Groupe avec un nom très long', color: 'group', avatar: 'https://picsum.photos/600', key: 'item5'}, {title: 'Centre International de Valbonne', type: 'location', key: 'item6'}],
              thumbnailUrl: 'https://picsum.photos/700',
              key: 'article3'
            },
            {
              title: 'Article 4',
              description: 'Cat sit like bread toilet paper attack claws fluff everywhere meow miao french ciao litterbox for run off table persian cat jump...',
              tags: [{title: 'Tag 1', color: 'red', type: 'tag', key: 'item1'}, {title: 'Tag 2', color: 'blue', type: 'tag', key: 'item2'}, {title: 'Tag 3', color: 'green', type: 'tag', key: 'item3'}, {title: 'Auteur', type: 'author', key: 'item4'}, {title: 'Groupe avec un nom très long', color: 'group', avatar: 'https://picsum.photos/600', key: 'item5'}, {title: 'Centre International de Valbonne', type: 'location', key: 'item6'}],
              thumbnailUrl: 'https://picsum.photos/700',
              key: 'article4'
            },
          ]}
          renderItem={({item: article, index: articleIndex, separators: articleSeparators}) => (
            <View style={{marginTop: 10, marginLeft: 10, marginRight: 10}}>
              <TouchableNativeFeedback useForeground={true}>
                <Card style={{borderWidth: 0.7, borderColor: 'lightgray', elevation: 0}}>
                  <Card.Title title={article.title} />
                  <Card.Cover source={{ uri: article.thumbnailUrl }} />
                  <Card.Content>
                    <View style={{marginTop: 10}}>
                      <Paragraph>{article.description}</Paragraph>
                    </View>
                  </Card.Content>
                  <Card.Content style={{paddingTop: 0, paddingLeft: 0, paddingRight: 0}}>
                    <View style={{marginTop: 10}}>
                      <FlatList
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={article.tags}
                        renderItem={({item: tag, index: tagIndex, separators: tagSeparators}) => (
                          <View style={{marginLeft: 10}}>
                            <Chip
                              mode="outlined"
                              icon={tag.avatar ? '' : this.genTagIcon(tag.type)}
                              avatar={tag.avatar ? (<Avatar.Image size={24} source={{ uri: 'https://picsum.photos/700' }} />) : ''}
                              style={{ borderColor: tag.color }}
                            >
                              {tag.title}
                            </Chip>
                          </View>
                        )}
                      />
                    </View>
                  </Card.Content>
                </Card>
              </TouchableNativeFeedback>
            </View>
          )}
        />
      </View>
    );
  }
}
