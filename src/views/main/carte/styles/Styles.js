import { StyleSheet } from 'react-native';
import { colors } from '../../../../styles/Styles';

console.log(colors.backdrop);

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.softContrast,
    backgroundColor: colors.background,
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  modalTitle: {
    paddingHorizontal: 8,
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 20,
    textAlignVertical: 'center',
    flex: 1,
  },
  modalIcon: {
    color: colors.primary,
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
    width: 40,
    height: 5,
    backgroundColor: colors.outline,
    borderRadius: 20,
  },
  pullUpTabContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 10,
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
});

export default styles;
