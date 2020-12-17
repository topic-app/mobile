import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { connect } from 'react-redux';

import LocationSelectPage from '@components/LocationSelectPage';
import { fetchMultiDepartment } from '@redux/actions/api/departments';
import { fetchMultiSchool } from '@redux/actions/api/schools';
import { updateArticleParams } from '@redux/actions/contentData/articles';
import { State, ReduxLocation, ArticleParams } from '@ts/types';

import type { ArticleParamsScreenNavigationProp, ArticleParamsStackParams } from '../index';

function done(
  { schools, departments, global }: Partial<ReduxLocation>,
  type: 'schools' | 'departements' | 'regions' | 'other',
  goBack: () => void,
) {
  updateArticleParams({
    schools,
    departments,
    global,
  }).then(() => {
    if (type === 'schools' && schools) {
      fetchMultiSchool(schools);
    } else if ((type === 'departements' || type === 'regions') && departments) {
      fetchMultiDepartment(departments);
    }
    goBack();
  });
}

type ArticleEditParamsProps = {
  navigation: ArticleParamsScreenNavigationProp<'EditParams'>;
  route: RouteProp<ArticleParamsStackParams, 'EditParams'>;
  articleParams: ArticleParams;
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
      callback={(location) => done(location, type, navigation.goBack)}
    />
  );
};

const mapStateToProps = (state: State) => {
  const { articleData } = state;
  return { articleParams: articleData.params };
};

export default connect(mapStateToProps)(ArticleEditParams);
