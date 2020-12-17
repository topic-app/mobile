import { RouteProp } from '@react-navigation/native';
import React from 'react';

import LocationSelectPage from '@components/LocationSelectPage';
import { ReduxLocation } from '@ts/types';

import type { ArticleAddScreenNavigationProp, ArticleAddStackParams } from '../index';

type ArticleEditParamsProps = {
  navigation: ArticleAddScreenNavigationProp<'Location'>;
  route: RouteProp<ArticleAddStackParams, 'Location'>;
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
      headerOptions={{
        subtitle: 'Ajouter un article',
      }}
    />
  );
}

export default ArticleAddLocation;
