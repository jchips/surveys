import { StyleSheet, Platform } from 'react-native';
import { BORDER, FONT, FONTSIZE } from './constants/styles';
import COLORS from './constants/colors';

const card = StyleSheet.create({
  container: {
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
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    margin: 0,
    marginBottom: 3,
    fontFamily: FONT.bold,
    fontSize: FONTSIZE.regular,
    fontWeight: 'normal',
    lineHeight: 20, // can delete if preferred
  },
  descriptionText: {
    color: '#808080',
    marginVertical: 3,
    lineHeight: 20,
    // fontSize: FONTSIZE.regular,
  },
  footer: {
    color: COLORS.primary,
    fontFamily: FONT.bold,
    fontSize: FONTSIZE.xsmall,
  },
});

export default card;