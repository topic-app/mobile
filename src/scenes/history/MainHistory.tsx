import React from 'react';
import { View, ScrollView } from 'react-native';
import { List, Divider, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { TranslucentStatusBar, CustomHeaderBar, FeedbackCard } from '@components';
import getStyles from '@styles/global';
import { ArticleReadItem, Preferences, State } from '@ts/types';

import { HistoryScreenNavigationProp } from '.';

type MainHistoryProps = {
  navigation: HistoryScreenNavigationProp<'Main'>;
  read: ArticleReadItem[];
  preferences: Preferences;
};

const MainHistory: React.FC<MainHistoryProps> = ({ navigation, preferences }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  return (
    <View style={styles.page}>
      <TranslucentStatusBar />
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              title: 'Historique',
            },
          },
        }}
      />
      <ScrollView>
        <List.Subheader>Historique</List.Subheader>
        <Divider />
        <List.Item
          disabled={!preferences.history}
          onPress={() => navigation.navigate('Article')}
          right={() => <List.Icon icon="chevron-right" />}
          title="Articles"
        />
        <List.Item
          disabled={!preferences.history}
          onPress={() => navigation.navigate('Event')}
          right={() => <List.Icon icon="chevron-right" />}
          title="Évènements"
        />
        <View style={{ height: 20 }} />
        <List.Subheader>Centres d&apos;interêt</List.Subheader>
        <Divider />
        {!preferences.recommendations ? (
          <List.Item
            title="Les recommandations sont désactivées"
            titleStyle={{ color: colors.disabled }}
          />
        ) : (
          <List.Item title="TODO" />
        )}
        <View style={{ marginTop: 20 }}>
          <FeedbackCard type="recommendations" />
        </View>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences } = state;
  return {
    preferences,
  };
};

export default connect(mapStateToProps)(MainHistory);
