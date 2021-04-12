import { createStyleSheet } from '@styles/helpers';

export default createStyleSheet(
  ({ colors }) => ({
    title: {
      color: colors.text,
      fontSize: 25,
      fontWeight: '400',
      marginBottom: 5,
    },
    captionText: {
      color: colors.disabled,
    },
  }),
  { global: true },
);
