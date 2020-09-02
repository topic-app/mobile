import React from 'react';
import { StackNavigationProp } from 'react-native-screens/native-stack';
import { connect } from 'react-redux';

import { State } from '@ts/types';
import { updateArticleParams } from '@redux/actions/contentData/articles';
import { fetchMultiSchool } from '@redux/actions/api/schools';
import LocationSelectPage from '@components/LocationSelectPage';
import { fetchMultiDepartment } from '@redux/actions/api/departments';
import { ErrorMessage } from '@components/index';

import getStyles from '@styles/Styles';

import type { ArticleStackParams } from '../index';

type Navigation = StackNavigationProp<ArticleStackParams, 'EditParams'>;

// TODO: Externalize into @ts/redux
type ReduxLocation = {
  global: boolean;
  schools: string[];
  departments: string[];
};

type ArticleEditParamsProps = {
  navigation: Navigation;
  route: {
    params: {
      type: 'schools' | 'departements' | 'regions' | 'other';
      hideSearch: boolean;
      callback: (location: ReduxLocation) => any;
      initialData: ReduxLocation;
    };
  };
};

function ArticleAddLocation({ navigation, route }: ArticleEditParamsProps) {
  const { hideSearch = false, type, initialData, callback } = route.params;

  return (
    <LocationSelectPage
      initialData={initialData}
      type={type}
      hideSearch={hideSearch}
      callback={(location: ReduxLocation) => {
        callback(location);
        navigation.goBack();
      }}
    />
  );
}

export default ArticleAddLocation;
