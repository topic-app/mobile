import { StyleSheet } from 'react-native';
import { colors, customStyles } from '../../../../styles/Styles';

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  modalContainer: {
    backgroundColor: colors.surface,
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  modalTitle: {
    paddingHorizontal: 8,
    color: colors.text,
    fontSize: 20,
    fontWeight: '100',
  },
  modalIcon: {
    paddingTop: 8,
    paddingRight: 6,
    color: colors.text,
    fontSize: 30,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 3,
  },
  modalAddress: {
    paddingHorizontal: 8,
    color: colors.disabled,
    fontSize: 15,
  },
  modalText: {
    color: colors.text,
    fontSize: 15,
  },
});

export default styles;
