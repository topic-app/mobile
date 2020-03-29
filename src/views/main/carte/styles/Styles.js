import { StyleSheet } from 'react-native';
import { isDark, colors } from '../../../../styles/Styles';

const carteStyles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  modalContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
    borderColor: colors.outline,
    borderWidth: isDark ? 0.5 : 0,
    backgroundColor: colors.background,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  modalTitle: {
    paddingHorizontal: 8,
    fontWeight: 'bold',
    fontSize: 20,
    textAlignVertical: 'center',
    flex: 1,
  },
  modalIcon: {
    textAlignVertical: 'center',
    fontSize: 22,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalText: {
    color: colors.text,
    fontSize: 17,
    paddingHorizontal: 2,
  },
  pullUpTab: {
    width: 70,
    height: 5,
    backgroundColor: colors.outline,
    borderRadius: 20,
  },
  pullUpTabContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 15,
  },
  horizontalLine: {
    width: '100%',
    height: 1.5,
    backgroundColor: colors.outline,
    borderRadius: 20,
  },
  horizontalLineContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  attribution: {
    fontSize: 10,
  },
  atributionMutedColor: {
    color: colors.muted,
  },
  attributionContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    position: 'absolute',
    backgroundColor: isDark ? '#44444466' : '#ffffff66',
    bottom: 0,
    right: 0,
  },
});

export default carteStyles;
