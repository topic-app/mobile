import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Content, ErrorMessage } from '@components/index';
import getStyles from '@styles/Styles';
import { RequestState } from '@ts/types';

type LegalPropTypes = {
  content: string;
  state: RequestState;
  strings: {
    what: string;
    contentSingular?: string;
    contentPlural?: string;
  };
  fetch: () => void;
};

function LegalPage({ state, content, strings, fetch }: LegalPropTypes) {
  const theme = useTheme();
  const styles = getStyles(theme);

  const { colors } = theme;

  return (
    <View style={styles.page}>
      {state.error && (
        <ErrorMessage type="axios" strings={strings} error={state.error} retry={fetch} />
      )}
      <ScrollView>
        {state.loading && (
          <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
        <View style={styles.contentContainer}>
          <Content parser="markdown" data={content} />
        </View>
      </ScrollView>
    </View>
  );
}

export default LegalPage;
