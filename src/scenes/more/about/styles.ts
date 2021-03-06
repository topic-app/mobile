import { createStyleSheet } from '@styles/helpers';

export default createStyleSheet(
  () => ({
    title: {
      fontSize: 60,
      fontFamily: 'Rubik-Light',
    },
    sectionTitle: {
      fontSize: 30,
    },
    sectionSubtitle: {
      fontSize: 24,
      marginBottom: 10,
    },
    headerContainer: {
      margin: 10,
      maxWidth: 600,
      width: '100%',
      alignSelf: 'center',
    },
    contentContainer: {
      padding: 20,
      width: '100%',
      maxWidth: 600,
      alignSelf: 'center',
    },
  }),
  { global: true },
);
