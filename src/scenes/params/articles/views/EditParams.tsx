import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { connect } from 'react-redux';

import { State, ReduxLocation } from '@ts/types';
import LocationSelectPage from '@components/LocationSelectPage';
import { updateArticleParams } from '@redux/actions/contentData/articles';
import { fetchMultiSchool } from '@redux/actions/api/schools';
import { fetchMultiDepartment } from '@redux/actions/api/departments';

import type { ArticleConfigureStackParams } from '../index';

function done(
  { schools, departments, global }: ReduxLocation,
  type: 'schools' | 'departements' | 'regions' | 'other',
  goBack: () => void,
) {
  updateArticleParams({
    schools,
    departments,
    global,
  }).then(() => {
    if (type === 'schools') {
      fetchMultiSchool(schools);
    } else if (type === 'departements' || type === 'regions') {
      fetchMultiDepartment(departments);
    }
    goBack();
  });
}

type ArticleEditParamsProps = StackScreenProps<ArticleConfigureStackParams, 'EditParams'> & {
  articleParams: ReduxLocation;
};

const ArticleEditParams: React.FC<ArticleEditParamsProps> = ({
  navigation,
  articleParams,
  route,
}) => {
  const { hideSearch, type } = route.params;

  return (
    <LocationSelectPage
      initialData={articleParams}
      type={type}
      hideSearch={hideSearch}
      callback={(location: ReduxLocation) => done(location, type, navigation.goBack)}
    />
  );
};

const mapStateToProps = (state: State) => {
  const { articleData } = state;
  return { articleParams: articleData.params };
};

export default connect(mapStateToProps)(ArticleEditParams);
