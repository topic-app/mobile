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
  },
  title: {
    fontSize: 30,
    marginBottom: 10,
  },
  stepIndicatorContainer: {
    margin: 10
  },
  formContainer: {
    margin: 20,
  }
});

export { authStyles };
export default authStyles;
