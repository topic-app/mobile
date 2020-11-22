/**
 * File containing frequently used types to be used in multiple places through the project.
 */

export * from './api';
export * from './requestState';
export * from './redux';
export type { RootState as State } from '@redux/reducers/index';
export type { Theme } from '@styles/Theme';

export type ModalProps = {
  visible: boolean;
  setVisible: (state: boolean) => void;
};
