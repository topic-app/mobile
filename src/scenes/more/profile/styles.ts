import { createStyleSheet } from '@styles/helpers';

export default createStyleSheet(
  ({ colors }) => ({
    profileItem: {
      margin: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    keyText: { color: colors.disabled },
    valueText: { fontSize: 24, fontFamily: 'Rubik' },
    inputContainer: {
      paddingHorizontal: 15,
      paddingBottom: 0,
      paddingTop: 15,
    },
    borderlessInput: {
      color: colors.text,
      fontSize: 16,
      padding: 0,
      paddingBottom: 10,
      paddingLeft: 2,
    },
  }),
  { global: true },
);
