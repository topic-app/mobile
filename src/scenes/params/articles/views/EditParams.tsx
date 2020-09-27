import React from 'react';
import { StackNavigationProp } from 'react-native-screens/native-stack';
import { connect } from 'react-redux';

import { State } from '@ts/types';
import { updateArticleParams } from '@redux/actions/contentData/articles';
import { fetchMultiSchool } from '@redux/actions/api/schools';
import LocationSelectPage from '@components/LocationSelectPage';
import { fetchMultiDepartment } from '@redux/actions/api/departments';

import type { ArticleStackParams } from '../index';

type Navigation = StackNavigationProp<ArticleStackParams, 'EditParams'>;

// TODO: Externalize into @ts/redux
type ReduxLocation = {
  global: boolean;
  schools: string[];
  departments: string[];
};

function done(
  { schools, departments, global }: ReduxLocation,
  type: 'schools' | 'departements' | 'regions' | 'other',
  navigation: Navigation,
) {
  Promise.all([
    updateArticleParams({
      schools,
      departments,
      global,
    }),
  ]).then(() => {
    if (type === 'schools') {
      fetchMultiSchool(schools);
    } else if (type === 'departements' || type === 'regions') {
      fetchMultiDepartment(departments);
    }
    navigation.goBack();
  });
}

type ArticleEditParamsProps = {
  navigation: Navigation;
  articleParams: ReduxLocation;
  route: {
    params: {
      type: 'schools' | 'departements' | 'regions' | 'other';
      hideSearch: boolean;
    };
  };
};

function ArticleEditParams({ navigation, articleParams, route }: ArticleEditParamsProps) {
  const { hideSearch, type } = route.params;

  return (
    <LocationSelectPage
      initialData={articleParams}
      type={type}
      hideSearch={hideSearch}
      callback={(location: ReduxLocation) => done(location, type, navigation)}
    />
  );
}

const mapStateToProps = (state: State) => {
  const { articleData } = state;
  return { articleParams: articleData.params };
};

export default connect(mapStateToProps)(ArticleEditParams);
