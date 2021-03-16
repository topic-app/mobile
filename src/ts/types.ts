/**
 * File containing frequently used types to be used in multiple places through the project.
 */
import * as Pages from './groupPages';

export * from './api';
export * from './requestState';
export * from './redux';
export type { RootState as State } from '@redux/reducers/index';
export type { Theme } from '@styles/helpers/theme';
export { Pages };

export type ModalProps = {
  visible: boolean;
  setVisible: (state: boolean) => void;
};
