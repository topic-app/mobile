import React from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';

import { CustomHeaderBar } from '@components';
import getStyles from '@styles/Styles';
import { useTheme } from '@utils';

const exampleNotifications = [
  {
    _id: '412384razejrl4312812394',
    date: new Date(2020, 11, 24),
    priority: 'urgent',
    content: {
      title: 'Nouvel Article Publié: Les pingouins, finalement sur Mars',
      description: 'Les pingouins se différencient des manchots par leurs capacité de voler et ...',
      icon: 'newspaper', // Nom des icones sur https://materialdesignicons.com/
      color: 'gray',
      actions: [
        {
          name: 'Marquer comme lu',
          action: "euh, demande à alex ce qu'est action :)",
          important: false,
        },
        { name: 'Partager', action: "euh, demande à alex ce qu'est action :)", important: false },
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
      icon: 'event',
      color: 'blue',
      actions: [
        {
          name: 'Ajouter au calendrier',
          action: "euh, demande à alex ce qu'est action :)",
          important: true,
        },
      ],
    },
  },
];

type NotificationsProps = {};

const Notifications: React.FC<NotificationsProps> = () => {
  const theme = useTheme();
  const styles = getStyles(theme);

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
      <Text>Je suis la page notifications!</Text>
      {/*
        Option 1: .map
        + Simple
        - Pas très performant
        - Pas de possibilité pour charger plus d'éléments quand on arrive à la fin de la liste
        - Nécéssite un ScrollView
      */}
      {exampleNotifications.map((notification) => (
        <Text key={notification._id}>{JSON.stringify(notification)}</Text>
      ))}

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
            <Text>{JSON.stringify(item)}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Notifications;
