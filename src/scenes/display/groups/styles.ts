import { createStyleSheet } from '@styles/helpers';

export default createStyleSheet(
  () => ({
    activeCommentContainer: {
      paddingHorizontal: 15,
      paddingBottom: 0,
      paddingTop: 15,
    },
    textInput: {
      width: '100%',
      alignSelf: 'center',
      paddingBottom: 3,
    },
  }),
  { global: true },
);
