import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/Styles';

const authStyles = StyleSheet.create({
  centerContainer: {
    marginTop: 50,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    width: '100%',
    maxWidth: 600,
    paddingBottom: 3,
  },
  textInputContainer: {
    alignSelf: 'stretch',
  },
  buttonContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  listContainer: {
    padding: 10,
  },
  descriptionContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  descriptionPartContainer: {
    marginVertical: 10,
  },
  title: {
    fontSize: 30,
    marginBottom: 10,
  },
  stepIndicatorContainer: {
    margin: 10,
  },
  formContainer: {
    margin: 20,
  },
  radio: {
    color: colors.primary,
  },
});

export { authStyles };
export default authStyles;
