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
    marginVertical: 10,
    marginHorizontal: 20
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
    marginVertical: 3,
    fontFamily: 'Lato-Regular',
    lineHeight: 20
  },
  boldText: {
    color: COLORS.primary,
    fontWeight: '500',
    fontFamily: 'Lato-Bold'
  },
  header: {
    fontSize: FONTSIZE.large,
    margin: 10,
    fontFamily: 'Lato-Bold'
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
    fontFamily: 'Lato-Regular',
    lineHeight: 20,
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
  },
  controllerContainer: {
    margin: 10,
  },
  errorText: {
    color: '#dc3545',
  },
});

export default app;