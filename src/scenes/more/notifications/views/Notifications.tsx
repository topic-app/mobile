import React from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Text, List, Button, Divider } from 'react-native-paper';

import { CustomHeaderBar, CollapsibleView } from '@components';
import getStyles from '@styles/Styles';
import { useTheme } from '@utils';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const exampleNotifications = [
  {
    _id: '412384razejrl4312812394',
    date: new Date(2020, 11, 24),
    priority: 'urgent',
    content: {
      title: 'Nouvel Article Publié: Les pingouins, finalement sur Mars',
      description: "Les pingouins se différencient des manchots par leurs capacité de voler et Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      icon: 'newspaper', // Nom des icones sur https://materialdesignicons.com/
      color: 'gray',
      actions: [
        {
          name: 'Marquer comme lu',
          action: "euh, demande à alex ce qu'est action :)",
          important: false,
        },
        { name: 'Partager', action: "euh, demande à alex ce qu'est action :)", important: false },
        { name: 'hello world this is a big string', action: "just any url", important: false },
      ],
    },
  },
  {
    _id: '41233124razejrl43128123',
    date: new Date(2020, 11, 22),
    priority: 'medium',
    content: {
      title: 'Nouvel évènement: portes ouvertes du CIV (virtuel)',
      description: 'Cette année, nous vous acceuillons au portes ouvertes du civ sur Jitsi ...',
      icon: 'radioactive',
      color: 'gold',
      actions: [
        {
          name: 'Ajouter au calendrier',
          action: "/event",
          important: true,
        },
      ],
    },
  },
];

type NotificationProps = {
  notification: { _id: string; date: Date; priority: string; content: { title: string; description: string; icon: string; color: string; actions: { name: string; action: string; important: boolean; }[] } }
  expanded: boolean;
  onPress: () => any;
}

const Notification: React.FC<NotificationProps> = ({ notification, expanded, onPress }) => {
  return (
    <View>

      <List.Item
        left={() => <Icon name={notification.content.icon} color={notification.content.color} size={50} />}
        title={notification.content.title}
        description={notification.content.description}
        titleNumberOfLines={expanded ? 1e4 : 2}
        descriptionNumberOfLines={expanded ? 1e4 : 3}
        onPress={onPress}
        descriptionStyle={{ textAlign: 'justify' }}
        titleStyle={{ textAlign: 'justify', marginRight: 50 }}
      />
      <CollapsibleView collapsed={!expanded}>
        {expanded && (
          <View style={{ flex: 1, flexDirection: 'row', maxWidth: '100%' }}>
            <FlatList horizontal
              data={notification.content.actions}
              keyExtractor={action => action.name}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Button mode={item.important ? 'contained' : 'text'} onPress={() => console.log(item.action)}>{item.name}</Button>
              )}
            />
            {/*notification.content.actions.map(action => <Button mode={action.important ? 'contained' : 'text'} onPress={() => console.log(action.action)}>{action.name}</Button>)*/}
          </View>
        )}
      </CollapsibleView>
      <Divider />
    </View>
  )
}

type NotificationsProps = {};

const Notifications: React.FC<NotificationsProps> = () => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [selectedID, setSelectedID] = React.useState('')

  return (
    <View style={styles.page}>
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              title: 'Notifications',
            },
          },
        }}
      />
      {/*
        Option 1: .map
        + Simple
        - Pas très performant
        - Pas de possibilité pour charger plus d'éléments quand on arrive à la fin de la liste
        - Nécéssite un ScrollView
      */}
      {/*exampleNotifications.map((notification) => (
        <Text key={notification._id}>{notification.content.title}</Text>
      ))*/}

      {/*
        Option 2: FlatList
        + Performant
        + Concu spécifiquement pour des longues listes
        + Peut obtenir des élémént supplémentaires quand on arrive à la fin de la liste
        + Peut scroll facilement, peut refresh, etc.
        - Pas super simple

        Pour les notifications, je te conseille d'utiliser FlatList mais je voulais quand même
        te montrer les autres possibilités
      */}
      <FlatList
        data={exampleNotifications}
        keyExtractor={(notification) => notification._id}
        renderItem={({ item }) => (
          <View>
            <Notification notification={item} onPress={() => setSelectedID(selectedID === item._id ? '' : item._id)} expanded={selectedID === item._id} />
          </View>
        )}
      />
    </View>
  );
};

export default Notifications;
