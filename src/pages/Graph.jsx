import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Switch,
  Platform,
} from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import app from '../styles/default';
import card from '../styles/card';
import { BORDER, FONT, FONTSIZE } from '../styles/constants/styles';
import COLORS from '../styles/constants/colors';

const Graph = ({ route }) => {
  const { responses, survey } = route.params;
  const [multiChoiceQs, setMultiChoiceQs] = useState([]);
  const [darkGraph, setDarkGraph] = useState(false);
  const toggleSwitch = () => setDarkGraph((previousState) => !previousState);

  /**
   * Filters only the questions that are multiple choice
   * while storing their original indices.
   */
  useEffect(() => {
    let arrWithIndices = survey.qs.map((q, index) => ({ ...q, index })); // change qs to questions
    let multiChoiceQsArr = arrWithIndices.filter(
      (q) => q.responseType === 'multiChoice'
    );
    setMultiChoiceQs(multiChoiceQsArr);
  }, []);

  // Generating a random number between 0 and 0xFFFFFF
  // Converting the number to a hexadecimal string and padding with zeros
  // code from Victory Native XL site:
  // https://commerce.nearform.com/open-source/victory-native/docs/polar/pie/pie-charts.
  const generateRandomColor = () => {
    const randomColor = Math.floor(Math.random() * 0xdddddd);
    return `#${randomColor.toString(16).padStart(6, '0')}`;
  };

  /**
   * Gathers the graph data used to display the graph.
   * @param {Integer} qIndex - The survey question index.
   * @returns {Object} - The graph data.
   */
  const setUpData = (qIndex) => {
    let labels = multiChoiceQs[qIndex].multiChoiceOptions.split(', ');
    return labels.map((label, i) => {
      let count = 0;
      responses.forEach((response) => {
        let radioGroupQIndex = `radioGroup${multiChoiceQs[qIndex].index + 1}`;
        // if radio group index matches the option index
        // only parse with MySQL db (not PostgreSQL)
        if (
          JSON.parse(response.response)[radioGroupQIndex] != null &&
          JSON.parse(response.response)[radioGroupQIndex] === i
        ) {
          count++;
        }
      });
      let randomColor = generateRandomColor();
      return {
        label: `${label}: ${count}`,
        value: count,
        color: randomColor,
        frontColor: randomColor,
        percentage: Math.round((count / responses.length) * 100) + '%', // not being used
      };
    });
  };

  /**
   * Renders the individual labels in the legend.
   * @param {String} text - The label.
   * @param {String} color - The color that goes along with the label.
   * @returns - The legend item as a <View> element.
   */
  const renderLegendItem = (text, color) => {
    let width = text.length > 16 ? '100%' : '50%';
    return (
      <View style={{ ...styles.legendItem, width }} key={text}>
        <View
          style={{
            ...styles.legendColor,
            backgroundColor: color || 'white',
          }}
        />
        <Text
          style={{
            ...styles.legendText,
            color: !darkGraph ? '#000' : COLORS.lightBG,
          }}
        >
          {text || ''}
        </Text>
      </View>
    );
  };

  // Renders the graph (card) for each multi-choice question.
  const renderItem = ({ item, index }) => {
    let data = setUpData(index);
    return (
      <View
        style={{
          ...styles.graphCardContainer,
          backgroundColor: !darkGraph ? 'rgba(230, 0, 18, 0.8)' : '#34448B',
        }}
      >
        <View
          style={{
            ...styles.graphCard,
            backgroundColor: !darkGraph ? COLORS.white : '#232B5D',
          }}
        >
          <Text
            style={{
              ...styles.graphCardTitle,
              color: !darkGraph ? '#000' : COLORS.white,
            }}
          >
            {item.question}
          </Text>
          <View style={{ alignItems: 'center', marginVertical: 10 }}>
            <PieChart
              strokeColor='#ac000d' // not being used
              strokeWidth={0}
              donut
              data={data}
              innerCircleColor={!darkGraph ? COLORS.white : '#232B5D'}
              innerCircleBorderWidth={0}
              innerCircleBorderColor='#ac000d' // not being used
              showValuesAsLabels={true}
              showText
              textColor='#000'
              font={FONT.regular}
              textSize={FONTSIZE.regular}
              showTextBackground={true}
              textBackgroundColor={!darkGraph ? COLORS.white : COLORS.lightBG}
              centerLabelComponent={() => {
                return (
                  <View style={styles.graphInnerCircle}>
                    <Text
                      style={{
                        ...styles.text,
                        fontSize: 36,
                        color: !darkGraph ? '#000' : COLORS.white,
                      }}
                    >
                      {responses.length}
                    </Text>
                    <Text
                      style={{
                        ...styles.text,
                        fontSize: 18,
                        color: !darkGraph ? '#000' : COLORS.white,
                      }}
                    >
                      Total
                    </Text>
                  </View>
                );
              }}
            />
          </View>
          <View style={styles.legend}>
            {data.map((label) => renderLegendItem(label.label, label.color))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={app.container}>
      <Text style={[app.header, styles.header]}>{survey.title}</Text>
      <Text style={styles.subHeaderText}>
        {responses.length} response(s) total
      </Text>
      {multiChoiceQs.length > 0 ? (
        <>
          <View style={styles.switch}>
            <Switch
              trackColor={{ false: '#767577', true: COLORS.secondary }}
              thumbColor={COLORS.white}
              ios_backgroundColor='#3e3e3e'
              onValueChange={toggleSwitch}
              value={darkGraph}
              style={{ marginRight: Platform.OS === 'ios' ? 10 : null }}
            />
            <Text style={app.text}>dark theme</Text>
          </View>
          <FlatList
            data={multiChoiceQs}
            renderItem={renderItem}
            numColumns={1}
            keyExtractor={(item) => item.question}
          />
        </>
      ) : (
        <Text
          style={{
            ...app.text,
            textAlign: 'center',
            fontFamily: FONT.semiBold,
          }}
        >
          Can only create graphs for multi-choice questions.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    color: COLORS.primary,
  },
  subHeaderText: {
    ...app.text,
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 5,
  },
  switch: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphCardContainer: {
    ...card.container,
    flex: 1,
    marginVertical: 5,
    padding: 10, // can delete
    // borderWidth: 1,
    // borderColor: COLORS.lightBG,
  },
  graphCard: {
    flex: 1,
    margin: 0,
    padding: 5,
    borderRadius: BORDER.radius,
  },
  graphCardTitle: {
    ...app.boldText,
    fontSize: FONTSIZE.regular,
    padding: 10,
  },
  text: {
    fontFamily: FONT.regular,
  },
  graphInnerCircle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 12,
    marginTop: 20,
    margin: 3,
    borderRadius: BORDER.radius,
  },
  legendItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  legendColor: {
    height: 25,
    width: 25,
    marginHorizontal: 10,
    borderRadius: 4,
  },
  legendText: {
    fontSize: FONTSIZE.small,
    fontFamily: FONT.regular,
  },
});

export default Graph;
