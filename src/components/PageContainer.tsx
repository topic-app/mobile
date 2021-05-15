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

  let component = children;

  if (scroll) {
    component = <ScrollView>{children}</ScrollView>;
  }

  if (centered) {
    component = <View style={styles.centeredPage}>{component}</View>;
  }

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
