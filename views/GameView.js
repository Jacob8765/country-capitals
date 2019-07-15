import React from "react";
import { View, StyleSheet, Animated, AsyncStorage } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient, AdMobInterstitial, AdMobBanner } from "expo";
import { Button, Subheading, Text } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
const appData = require("../appContent.json");

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  button: {
    paddingTop: 7,
    paddingBottom: 7,
    margin: 5,
    width: "100%",
    color: "black"
  },

  bottomItems: {
    marginTop: "auto"
  },

  answerChoices: {
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10
  },

  questionText: {
    fontSize: 30,
    color: "white",
    padding: 8
  },

  questionCountry: {
    fontSize: 44,
    color: "white",
    padding: 5,
    marginTop: -8,
    lineHeight: 50,
    textAlign: "center"
  },

  questionTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    flex: 0.8
  },

  statistics: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10
  },

  statisticsText: {
    fontSize: 17,
    color: "white"
  },

  gameEndScoreTextContainer: {
    margin: 50,
    flexDirection: "column",
    justifyContent: "center"
  },

  answeredQuestions: {
    padding: 10
  },

  answeredQuestion: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  questionNumberText: { 
    color: "white",
    paddingBottom: 1
  },

  questionQuestionText: {
    fontSize: 16,
    color: "white",
    paddingBottom: 1,
    maxWidth: 275
  },

  yourAnswerText: {
    fontSize: 14,
    color: "white",
    maxWidth: 275
  }
});

export default class GameView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gameOver: false,
      darkTheme: false,
      currentCountry: "",
      currentAnswers: [],
      countryTextOpacity: new Animated.Value(1),
      currentQuestionNumber: 1,
      currentPercentComplete: 0,
      percentCorrect: 0
    };

    const willBlur = this.props.navigation.addListener("willBlur", payload => {
      console.log("unloading");
      this.resetLevel();
    });

    this.questionList = this.shuffleArray(appData.levels[this.props.navigation.state.params.levelNumber - 1].questions);
    this.answerList = appData.levels[this.props.navigation.state.params.levelNumber - 1].answers;
    this.answeredQuestions = [];
  }

  componentDidMount() {
    AdMobInterstitial.setAdUnitID("ca-app-pub-7664984868766495/2082796458"); //ca-app-pub-3940256099942544/1033173712
    AdMobInterstitial.setTestDeviceID("EMULATOR");
    AdMobInterstitial.requestAdAsync();

    AsyncStorage.getItem("darkTheme").then(darkThemeValue => {
      this.setState({ darkTheme: darkThemeValue == "true" ? true : false, loading: false });
    });

    this.newQuestion(false);
  }

  newQuestion = (transition, index) => {
    if (transition) {
      this.answeredQuestions.push({
        country: this.state.currentCountry,
        answerChoices: this.state.currentAnswers,
        answerClicked: index,
        correctAnswer: this.state.currentAnswers.indexOf(this.answerList[this.questionList[this.answeredQuestions.length].answer])
      });
    }

    if (this.questionList.length - this.answeredQuestions.length > 0) {
      let currentCountry = this.questionList[this.answeredQuestions.length].countryName;
      let currentAnswers = [this.answerList[this.questionList[this.answeredQuestions.length].answer]];

      let i = 0;

      while (i < 3) {
        let randomNumber = Math.floor(Math.random() * this.answerList.length - 1);

        if (currentAnswers.indexOf(this.answerList[randomNumber]) !== "undefined" && this.answerList[randomNumber] && currentAnswers.indexOf(this.answerList[randomNumber]) == -1) {
          currentAnswers.push(this.answerList[randomNumber]);
          i++;
        }
      }

      if (transition) {
        this.setState({ currentAnswers: this.shuffleArray(currentAnswers), currentQuestionNumber: this.state.currentQuestionNumber + 1, currentPercentComplete: parseInt(((this.state.currentQuestionNumber + 1) / 25) * 100) });
        this.questionTransition(currentCountry);
      } else {
        this.setState({ currentCountry: currentCountry, currentAnswers: this.shuffleArray(currentAnswers) });
      }
    } else {
      this.endGame();
    }
  };

  questionTransition = currentCountry => {
    Animated.timing(this.state.countryTextOpacity, { toValue: 0, duration: 200 }).start(() => {
      this.setState({ currentCountry: currentCountry });
      Animated.timing(this.state.countryTextOpacity, { toValue: 1, duration: 200 }).start();
    });
  };

  endGame = async () => {
    AdMobInterstitial.showAdAsync();
    let percentCorrect = 0;

    this.answeredQuestions.map(question => (question.answerClicked == question.correctAnswer ? (percentCorrect += 1) : null));
    await this.setState({ percentCorrect: parseInt((percentCorrect / 25) * 100), gameOver: true });

    if (this.state.percentCorrect == 100) {
      let unlockedLevels = await AsyncStorage.getItem("unlockedLevels");

      if (unlockedLevels == null) {
        await AsyncStorage.setItem("unlockedLevels", "[1,2]");
      } else {
        let levels = JSON.parse(unlockedLevels);
        levels.push(this.props.navigation.state.params.levelNumber + 1);
        await AsyncStorage.setItem("unlockedLevels", JSON.stringify(levels));
      }
    }
  };

  shuffleArray = array => {
    var m = array.length;
    while (m) {
      let i = Math.floor(Math.random() * m--);
      [array[m], array[i]] = [array[i], array[m]];
    }
    return array;
  };

  resetLevel = async () => {
    this.answeredQuestions = [];
    this.questionList = this.shuffleArray(this.questionList);
    AdMobInterstitial.requestAdAsync();

    await this.setState({
      gameOver: false,
      currentCountry: "",
      currentAnswers: [],
      currentQuestionNumber: 1,
      currentPercentComplete: 0,
      percentCorrect: 0
    });

    this.newQuestion(false);
  };

  render() {
    if (!this.state.gameOver) {
      return (
        <LinearGradient style={styles.container} colors={this.state.darkTheme ? ["#303F9F", "#7B1FA2"] : ["#3949AB", "#4FC3F7"]} start={[0, 1]} end={[1, 0]}>
          <View style={{ justifyContent: "center" }}>
            <AdMobBanner
              bannerSize="fullBanner"
              adUnitID="ca-app-pub-7664984868766495/4583523632" // ca-app-pub-3940256099942544/6300978111
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
            />
          </View>

          <View style={styles.questionTextContainer}>
            <Subheading style={styles.questionText}>What is the capital of..</Subheading>
            <Animated.View style={{ opacity: this.state.countryTextOpacity }}>
              <Subheading style={styles.questionCountry}>{this.state.currentCountry}</Subheading>
            </Animated.View>
          </View>

          <View style={styles.bottomItems}>
            <View style={styles.answerChoices}>
              {this.state.currentAnswers.map((answer, index) => (
                <Button mode="contained" key={index} onPress={() => this.newQuestion(true, index)} color="white" style={styles.button}>
                  {answer}
                </Button>
              ))}
            </View>

            <View style={styles.statistics}>
              <Text style={styles.statisticsText}>{this.state.currentPercentComplete}% Complete</Text>
              <Text style={styles.statisticsText}>{this.state.currentQuestionNumber}/25</Text>
            </View>
          </View>
        </LinearGradient>
      );
    } else {
      return (
        <LinearGradient style={styles.container} colors={this.state.darkTheme ? ["#303F9F", "#7B1FA2"] : ["#3949AB", "#4FC3F7"]} start={[0, 1]} end={[1, 0]}>
          <View style={{ justifyContent: "center" }}>
            <AdMobBanner
              bannerSize="fullBanner"
              adUnitID="ca-app-pub-7664984868766495/1892946966" // ca-app-pub-3940256099942544/6300978111
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
            />
          </View>

          <ScrollView>
            <View style={[styles.gameEndScoreTextContainer, { marginTop: 25 }]}>
              <Subheading style={[styles.questionText, { textAlign: "center" }]}>You scored {this.state.percentCorrect}%</Subheading>
              {this.state.percentCorrect == 100 ? (
                <Button mode="contained" style={{ padding: 5, paddingHorizontal: 10, marginTop: 5 }} onPress={() => this.props.navigation.navigate("Home")}>
                  Continue
                </Button>
              ) : (
                <Button mode="contained" style={{ padding: 5, paddingHorizontal: 10, marginTop: 3 }} onPress={this.resetLevel}>
                  Retry level
                </Button>
              )}
            </View>

            <View style={styles.answeredQuestions}>
              {this.answeredQuestions.map((question, index) => (
                <View style={styles.answeredQuestion} key={index}>
                  <View>
                    <Text style={styles.questionNumberText}>Question #{index + 1}</Text>
                    <Text style={styles.questionQuestionText}>What is the capital of {question.country}?</Text>
                    <Text style={styles.yourAnswerText}>Correct answer: {question.answerChoices[question.correctAnswer]}</Text>
                  </View>

                  <Feather name={question.answerClicked == question.correctAnswer ? "check-circle" : "x-circle"} size={56} color={question.answerClicked == question.correctAnswer ? "green" : "red"} />
                </View>
              ))}
            </View>
          </ScrollView>
        </LinearGradient>
      );
    }
  }
}
