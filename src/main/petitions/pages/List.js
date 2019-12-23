import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput } from 'react-native';

import { Button, Card, Avatar, Title, Paragraph } from 'react-native-paper';

export default class CarteListScreen extends React.Component {
  static navigationOptions = {
    title: 'Petitions',
  };
  render() {
    const {navigate} = this.props.navigation;
    return (
      <View>
        <View style={{alignItems: 'center', margin: 10}}>
          <Button
            icon="camera"
            mode="contained"
            color="red"
            dark
            onPress={() => navigate('CarteDisplay', {title: 'Article1'})}
            style={{width: 200}}
          >
            Hello
          </Button>
        </View>
        <View style={{alignItems: 'center'}}>
          <Button
            icon="camera"
            mode="contained"
            color="red"
            dark
            onPress={() => navigate('CarteArticle', {title: 'Article1'})}
            style={{width: 200, margin: 10}}
          >
            Hello2
          </Button>
        </View>
        <View style={{alignItems: 'center', margin: 20, width: 500}}>
          <Card style={{width: 500}}>
            <Card.Title title="Card Title" subtitle="Card Subtitle" left={(props) => <Avatar.Icon {...props} icon="folder" />} />
            <Card.Content>
              <Title>Card title</Title>
              <Paragraph>Card content</Paragraph>
            </Card.Content>
            <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
            <Card.Actions>
              <Button>Cancel</Button>
              <Button>Ok</Button>
            </Card.Actions>
          </Card>
        </View>
      </View>
    );
  }
}
