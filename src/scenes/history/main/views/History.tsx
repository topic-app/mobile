import React from 'react';
import { View, ScrollView } from 'react-native';
import { List, Divider } from 'react-native-paper';
import { connect } from 'react-redux';

import { ArticleReadItem, Preferences, State } from '@ts/types';
import { useTheme } from '@utils/index';
import getStyles from '@styles/Styles';

type MainHistoryProps = {
  navigation: StackNavigationProp<any, any>;
  read: ArticleReadItem[];
  preferences: Preferences;
};

const MainHistory: React.FC<MainHistoryProps> = ({ navigation, preferences }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  return (
    <View style={styles.page}>
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
          title="Événements"
        />
        <View style={{ height: 20 }} />
        <List.Subheader>Centres d&amp;interêt</List.Subheader>
        <Divider />
        {!preferences.recommendations ? (
          <List.Item
            title="Les recommendations sont desactivées"
            titleStyle={{ color: colors.disabled }}
          />
        ) : (
          <List.Item title="TODO" />
        )}
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
