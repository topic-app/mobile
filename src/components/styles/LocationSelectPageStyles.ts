import { createStyleSheet } from '@styles/helpers';

export default createStyleSheet(
  () => ({
    listItem: { padding: 6 },
    searchContainer: {
      paddingHorizontal: 20,
      paddingBottom: 5,
      paddingTop: 10,
      width: '100%',
      maxWidth: 600,
      alignSelf: 'center',
    },
    buttonContainer: {
      marginHorizontal: 10,
      marginVertical: 10,
    },
  }),
  { global: true },
);
