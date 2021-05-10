import { createStyleSheet } from '@styles/helpers';

export default createStyleSheet(
  () => ({
    listItem: { padding: 6 },
    searchContainer: {
      paddingTop: 10,
      paddingHorizontal: 15,
      paddingBottom: 10,
      width: '100%',
      maxWidth: 600,
      alignSelf: 'center',
    },
    buttonContainer: {
      alignSelf: 'center',
      flexDirection: 'row',
    },
  }),
  { global: true },
);
