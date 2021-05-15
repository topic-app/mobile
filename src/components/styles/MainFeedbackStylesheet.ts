import { createStyleSheet } from '@styles/helpers';

export default createStyleSheet(
  () => ({
    textInput: {
      width: '100%',
      alignSelf: 'center',
      paddingBottom: 3,
    },
    buttonContainer: {},
  }),
  { global: true },
);
