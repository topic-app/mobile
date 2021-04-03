import React from 'react';
import { ScrollView, View } from 'react-native';
import { ProgressBar, useTheme } from 'react-native-paper';

import getStyles from '@styles/global';

import ErrorMessage, { ErrorMessageProps } from './ErrorMessage';
import { HeaderBar, HeaderBarProps } from './Header';

type Props = {
  headerOptions?: HeaderBarProps;
  scroll?: boolean;
  centered?: boolean;
  loading?: boolean;
  showError?: boolean | null | undefined | object;
  errorOptions?: ErrorMessageProps;
};

const PageContainer: React.FC<Props> = ({
  children,
  headerOptions,
  scroll,
  centered,
  loading,
  showError,
  errorOptions,
}) => {
  const styles = getStyles(useTheme());

  let component = scroll ? <ScrollView>{children}</ScrollView> : children;
  component = centered ? <View style={styles.centeredPage}>{component}</View> : component;

  return (
    <View style={styles.page}>
      {headerOptions ? <HeaderBar {...headerOptions} /> : null}
      {loading && <ProgressBar indeterminate />}
      {showError && errorOptions ? <ErrorMessage {...errorOptions} /> : null}
      {component}
    </View>
  );
};

export default PageContainer;
