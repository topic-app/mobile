import React from 'react';
import PropTypes from 'prop-types';
import { ProgressBar, Divider, Text, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import ErrorMessage from '@components/ErrorMessage';
import { InlineCard } from '@components/Cards';
import { fetchSchool } from '@redux/actions/api/schools';
import { fetchDepartment } from '@redux/actions/api/departments';
import { fetchTag } from '@redux/actions/api/tags';
import { fetchGroup } from '@redux/actions/api/groups';
import getStyles from '@styles/Styles';
import CustomTabView from '@components/CustomTabView';

import IllustrationConfigureDark from '@assets/images/illustrations/configure/configure_dark.svg';
import IllustrationConfigureLight from '@assets/images/illustrations/configure/configure_light.svg';

function ArticleLists({ articles, state }) {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.page}>
      {state.info.loading && <ProgressBar indeterminate />}
      {state.info.error && <ErrorMessage type="axios" error={state.info.error} retry={fetch} />}
      <ScrollView>
        <View style={styles.centerIllustrationContainer}>
          {theme.dark ? (
            <IllustrationConfigureDark height={200} width={200} />
          ) : (
            <IllustrationConfigureLight height={200} width={200} />
          )}
        </View>
        <Divider />
        <CustomTabView
          scrollEnabled
          pages={articles.lists.map((l) => {
            return {
              key: l.id,
              title: l.name,
              component: (
                <View>
                  <Text>Hello from {l.name}</Text>
                </View>
              ),
            };
          })}
        />
      </ScrollView>
    </View>
  );
}

const mapStateToProps = (state) => {
  const { articles } = state;
  return {
    articles,
    state: articles.state,
  };
};

export default connect(mapStateToProps)(ArticleLists);

const tagPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
});

ArticleLists.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  params: PropTypes.shape().isRequired,
  state: PropTypes.shape({
    info: PropTypes.shape({}).isRequired,
  }).isRequired,
};
