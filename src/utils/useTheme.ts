import { useTheme } from 'react-native-paper';
import { Theme } from '../ts/types';

type ReplaceReturnType<T extends (...a: any) => any, NewReturn> = (
  ...a: Parameters<T>
) => NewReturn;

// Re-export useTheme for correct return type
export default useTheme as ReplaceReturnType<typeof useTheme, Theme>;
