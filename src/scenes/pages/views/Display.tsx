import React from 'react';
import { View, Appearance, FlatList } from 'react-native';
import { List } from 'react-native-paper';
import { connect } from 'react-redux';

import { CustomHeaderBar } from '@components/index';
import getStyles from '@styles/Styles';
import themes from '@styles/Theme';
import { Account, Pages, Preferences, State } from '@ts/types';
import { useTheme } from '@utils/index';

import Page from '../components/Page';
import type { PagesScreenNavigationProp } from '../index';
import getSettingsStyles from '../styles/Styles';

type PageDisplayProps = {
  navigation: PagesScreenNavigationProp<'Display'>;
};

const PageDisplay: React.FC<PageDisplayProps> = ({ navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const localStyles = getSettingsStyles(theme);

  const page: Pages.Page = {
    page: 'main',
    main: true,
    content: [
      {
        type: 'gradient',
        data: { start: '#592989', end: '#123456', angle: 45 },
        columns: [
          {
            align: 'center',
            elements: [
              {
                type: 'image',
                data: {
                  image: { image: '5fee1a102a8c4700193964ad', thumbnails: { large: true } },
                  mode: 'center',
                  height: 100,
                },
              },
              {
                type: 'menu',
                data: {
                  color: '#FFFFFF',
                  elements: [
                    { type: 'external', text: 'Présentation', url: 'https://example.org' },
                    { type: 'external', text: 'Membres', url: 'https://example.org' },
                    { type: 'internal', text: 'Initiatives', page: 'secondary' }, // Links not starting with http just go to a page of the group
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        type: 'color',
        data: { color: '#3480be' },
        columns: [
          {
            elements: [
              {
                type: 'content',
                data: {
                  content: {
                    data:
                      "# Titre\nDu contenu markdown avec du *gras* et de _l'italique_ en plus\nPuis une image parce que pourquoi pas\n![](cdn://5fda2aa2a1d6970019fdecd6)",
                    parser: 'markdown',
                  },
                  color: '#3480be',
                  size: 20,
                },
              },
            ],
          },
        ],
      },
      {
        type: 'image',
        minHeight: 400,
        data: {
          image: {
            image: '601ea35ef44181001a19c8a7',
            thumbnails: {
              small: false,
            },
          },
          mode: 'contain',
        },

        columns: [
          {
            align: 'center',
            alignVertical: 'center',
            elements: [
              {
                type: 'menu',
                data: {
                  color: '#FFFFFF',
                  height: 50,
                  elements: [
                    {
                      text: 'Rejoindre',
                      type: 'internal',
                      page: 'join',
                      mode: 'contained',
                    },
                    {
                      text: 'Contacter',
                      type: 'internal',
                      page: 'contact',
                      mode: 'outlined',
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        type: 'color',
        data: { color: '#3f51b5' },
        minHeight: 200,
        columns: [
          {
            elements: [
              {
                type: 'content',
                data: {
                  content: {
                    data:
                      "### Découvrez nos articles !\nIls sont écrits par je sais pas qui et l'équipe de rédaction. Bon je sais pas trop quoi dire d'autre sur les articles, mais il faut quand meme que ce soit une description assez longue donc voila c'est du texte au hasard.",
                    parser: 'markdown',
                  },
                  color: '#FFFFFF',
                  size: 20,
                },
              },
              {
                type: 'contentTabView',
                data: {
                  types: ['articles', 'events'],
                  theme: 'dark',
                  params: { groups: ['5fe204169543ce00190c5624'] },
                },
              },
            ],
          },
        ],
      },
    ],
  };

  return (
    <View style={styles.page}>
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              title: 'Test',
            },
          },
        }}
      />
      <Page navigation={navigation} page={page} />
    </View>
  );
};

export default PageDisplay;
