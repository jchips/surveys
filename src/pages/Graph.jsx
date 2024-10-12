import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import app from '../styles/default';
import { BORDER, FONTSIZE } from '../styles/constants/styles';
import COLORS from '../styles/constants/colors';

const Graph = ({ route }) => {
  const { responses, survey } = route.params;
  const [multiChoiceQs, setMultiChoiceQs] = useState([]);

  /**
   * Filters only the questions that are multiple choice
   * while storing their original indices.
   */
  useEffect(() => {
    let arrWithIndices = survey.questions.map((q, index) => ({ ...q, index }));
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
        if (
          response.response[radioGroupQIndex] != null &&
          response.response[radioGroupQIndex] === i
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
    let width = text.length > 17 ? '100%' : '50%';
    return (
      <View style={{ ...styles.legendItem, width }} key={text}>
        <View
          style={{
            ...styles.legendColor,
            backgroundColor: color || 'white',
          }}
        />
        <Text style={styles.legendText}>{text || ''}</Text>
      </View>
    );
  };

  // Renders the graph (card) for each multi-choice question.
  const renderItem = ({ item, index }) => {
    let data = setUpData(index);
    return (
      <View style={styles.graphCardContainer}>
        <View style={styles.graphCard}>
          <Text style={styles.graphCardTitle}>{item.question}</Text>
          <View style={{ alignItems: 'center', marginVertical: 10 }}>
            <PieChart
              strokeColor='#ac000d' // not being used
              strokeWidth={0}
              donut
              data={data}
              innerCircleColor='#232B5D'
              innerCircleBorderWidth={0}
              innerCircleBorderColor='#ac000d' // not being used
              showValuesAsLabels={true}
              showText
              textColor='#000'
              font='Lato-Bold'
              textSize={FONTSIZE.regular}
              showTextBackground={true}
              textBackgroundColor={COLORS.lightBG}
              centerLabelComponent={() => {
                return (
                  <View style={styles.graphInnerCircle}>
                    <Text style={{ ...styles.text, fontSize: 36 }}>
                      {responses.length}
                    </Text>
                    <Text style={{ ...styles.text, fontSize: 18 }}>Total</Text>
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
        <FlatList
          data={multiChoiceQs}
          renderItem={renderItem}
          numColumns={1}
          keyExtractor={(item) => item.question}
        />
      ) : (
        <Text style={app.text}>
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
  graphCardContainer: {
    ...app.card,
    flex: 1,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.lightBG,
    backgroundColor: '#34448B',
  },
  graphCard: {
    flex: 1,
    margin: 0,
    padding: 5,
    borderRadius: BORDER.radius,
    backgroundColor: '#232B5D',
  },
  graphCardTitle: {
    ...app.boldText,
    fontSize: FONTSIZE.regular,
    padding: 10,
    color: COLORS.white,
  },
  text: {
    color: COLORS.white,
    fontFamily: 'Lato-Regular',
  },
  graphInnerCircle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legend: {
    // flex: 1,
    width: '100%',
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    // width: '50%',
  },
  legendColor: {
    height: 25,
    width: 25,
    marginHorizontal: 10,
    borderRadius: 4,
  },
  legendText: {
    color: COLORS.lightBG,
    fontSize: FONTSIZE.regular,
    fontFamily: 'Lato-Regular',
  },
});

export default Graph;
