import { StyleSheet } from 'react-native';

import getGlobalStyles from '@styles/global';
import getNavigatorStyles from '@styles/navigators';
import { Theme } from '@ts/types';

type GlobalStyles = ReturnType<typeof getGlobalStyles>;
type NavigatorStyles = ReturnType<typeof getNavigatorStyles>;
type StyleSheetGetter<T> = (theme: Theme) => T;

export default function createStyleSheet<
  S extends StyleSheet.NamedStyles<any>,
  G extends boolean,
  N extends boolean
>(
  styleSheetObjGetter: StyleSheetGetter<S>,
  options?: { global?: G; navigators?: N },
): StyleSheetGetter<
  S & (G extends true ? GlobalStyles : {}) & (N extends true ? NavigatorStyles : {})
> {
  // @ts-expect-error
  return (theme) => {
    let extraStyles = {};

    if (options?.global) {
      extraStyles = { ...extraStyles, ...getGlobalStyles(theme) };
    }

    if (options?.navigators) {
      extraStyles = { ...extraStyles, ...getNavigatorStyles(theme) };
    }

    return { ...extraStyles, ...StyleSheet.create(styleSheetObjGetter(theme)) };
  };
}
