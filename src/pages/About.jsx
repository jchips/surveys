import React from 'react';
import { StyleSheet, View, Text, FlatList, Linking } from 'react-native';
import changelog from '../util/changelog.json';
import app from '../styles/default';
import card from '../styles/card';
import { BORDER, FONT, FONTSIZE } from '../styles/constants/styles';
import COLORS from '../styles/constants/colors';

const About = () => {
  return (
    <View style={{ ...app.container, flexDirection: 'column' }}>
      <View style={{ flex: 1 }}>
        <View style={[card.container, styles.cardContainer]}>
          <Text style={styles.title}>Surveys</Text>
          <Text style={styles.subTitle}>Version 1.0.0</Text>
        </View>
        <View style={styles.changelog}>
          <Text style={[card.title, styles.cardTitle]}>Changelog</Text>
          <FlatList
            data={changelog}
            renderItem={({ item }) => (
              <View style={styles.changelogItem}>
                <Text style={styles.version}>{item.version}</Text>
                {item.changes.map((bullet) => (
                  <Text style={styles.bullet} key={bullet}>
                    • {bullet}
                  </Text>
                ))}
              </View>
            )}
            numColumns={1}
            keyExtractor={(item) => item.version}
            style={styles.changelogContainer}
          />
        </View>
      </View>
      <View style={styles.credits}>
        <Text style={[app.text, styles.creditsText]}>
          &copy; Jelani R. Icons by{' '}
        </Text>
        <Text
          style={[app.text, styles.creditsText, styles.link]}
          onPress={() => Linking.openURL('http://icons8.com')}
        >
          icons8
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 15,
    marginTop: 5,
    marginBottom: 10,
  },
  title: {
    color: COLORS.primary,
    fontSize: FONTSIZE.xlarge,
    fontFamily: FONT.bold,
    marginBottom: 5,
  },
  subTitle: {
    fontSize: FONTSIZE.small,
    fontFamily: FONT.semiBold,
  },
  cardTitle: {
    color: COLORS.primary,
    fontSize: FONTSIZE.large,
  },
  changelog: {
    ...card.container,
    flexGrow: 1,
    flexShrink: 1,
    marginBottom: 10,
    padding: 20,
  },
  changelogContainer: {
    // backgroundColor: '#f7f7f7',
    // marginTop: 10,
    paddingHorizontal: 10,
    borderRadius: BORDER.radius,
  },
  changelogItem: {
    marginVertical: 5,
  },
  version: {
    color: COLORS.primary,
    fontFamily: FONT.bold,
  },
  bullet: {
    marginLeft: 5,
    fontFamily: FONT.regular,
    fontSize: FONTSIZE.small,
  },
  credits: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  creditsText: {
    fontSize: FONTSIZE.small,
    fontFamily: FONT.bold,
  },
  link: {
    color: COLORS.secondary,
    fontFamily: FONT.semiBold,
  },
});

export default About;
