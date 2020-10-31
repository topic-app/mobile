import React from 'react';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import { ReduxLocation } from '@ts/types';
import LocationSelectPage from '@components/LocationSelectPage';

import type { ArticleAddStackParams } from '../index';

type Navigation = StackNavigationProp<ArticleAddStackParams, 'Location'>;

type ArticleEditParamsProps = StackScreenProps<ArticleAddStackParams, 'Location'>;

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
