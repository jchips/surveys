import { StyleSheet, Platform } from 'react-native';
import { BORDER, FONTSIZE } from './constants/styles';
import COLORS from './constants/colors';

const app = StyleSheet.create({
  newPageText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    margin: 10,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER.radius,
    padding: 15,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  text: {
    fontSize: FONTSIZE.regular,
    marginVertical: 3
  },
  boldText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  header: {
    fontWeight: '700',
    fontSize: FONTSIZE.large,
    margin: 10
  },
  icon: {
    height: 25,
    width: 25,
  },
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER.radius,
    height: 48,
    justifyContent: 'center',
    margin: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONTSIZE.regular,
  },
  errorAlert: {
    backgroundColor: 'rgb(248, 215, 218)',
    padding: 16,
    borderRadius: 8,
    margin: 10,
  },
  singleLineInput: {
    backgroundColor: 'white',
    borderColor: 'none',
    height: 48,
    padding: 10,
    borderRadius: 8,
  },
  multilineInput: {
    backgroundColor: 'white',
    borderColor: 'none',
    padding: 10,
    borderRadius: 8,
    textAlignVertical: 'top',
  }
});

export default app;