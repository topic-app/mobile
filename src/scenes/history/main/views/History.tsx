import React from 'react';
import PropTypes from 'prop-types';
import { List, Text, Divider, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { View, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { ArticleReadItem, Preferences } from '@ts/types';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { ErrorMessage, InlineCard, PlatformTouchable } from '@components/index';
import getStyles from '@styles/Styles';
import { deleteArticleRead } from '@redux/actions/contentData/articles';

type MainHistoryProps = {
  navigation: any;
  read: ArticleReadItem[];
  preferences: Preferences;
};

function MainHistory({ navigation, read, preferences }: MainHistoryProps) {
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
          onPress={() =>
            navigation.navigate('Main', {
              screen: 'History',
              params: {
                screen: 'Article',
              },
            })
          }
          right={() => <List.Icon icon="chevron-right" />}
          title="Articles"
        />
        <View style={{ height: 20 }} />
        <List.Subheader>Recommendations</List.Subheader>
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
}

const mapStateToProps = (state) => {
  const { preferences } = state;
  return {
    preferences,
  };
};

export default connect(mapStateToProps)(MainHistory);
