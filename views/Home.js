import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { Text, Surface, TouchableRipple } from "react-native-paper";
import { View, StyleSheet, ScrollView, AsyncStorage, Alert } from "react-native";
import { scale } from "../functions/AutoScale";
import Navbar from "./Navbar";
const appData = require("../appContent.json");

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      levelsPassed: [1],
      darkTheme: false,
      loading: true
    };

    const willFocus = this.props.navigation.addListener("willFocus", payload => {
      this.getData();
    });
  }

  getData = () => {
    AsyncStorage.getItem("unlockedLevels").then(levels => {
      if (levels !== null && JSON) {
        this.setState({ levelsPassed: JSON.parse(levels) });
      }
    });

    AsyncStorage.getItem("darkTheme").then(darkThemeValue => {
      this.setState({ darkTheme: darkThemeValue == "true" ? true : false, loading: false });
    });
  };

  render() {
    if (!this.state.loading) {
      return (
        <ScrollView style={[styles.container, { backgroundColor: this.state.darkTheme ? "#212121" : "white" }]}>
          <Navbar showBackButton={false} showSettingsButton={true} navigation={this.props.navigation} darkTheme={this.state.darkTheme} />

          {appData.levels.map((level, index) => (
            <Surface key={index} style={styles.surface}>
              <LinearGradient style={{ borderRadius: scale(10) }} colors={[level.gradientValue1, level.gradientValue2]} start={[0, 1]} end={[1, 0]}>
                <TouchableRipple style={{ padding: scale(2) }} onPress={() => (this.state.levelsPassed.indexOf(level.levelNumber) !== -1 ? this.props.navigation.navigate("GameView", { levelNumber: level.levelNumber }) : Alert.alert(`You must complete level ${level.levelNumber - 1} before this level can be unlocked.`))}>
                  <View>
                    <Text style={styles.headerText}>{level.name}</Text>
                    <Text style={styles.descriptionText}>{level.description}</Text>

                    <View style={styles.iconView}>
                      <Feather name={this.state.levelsPassed.indexOf(level.levelNumber) !== -1 ? "play" : "lock"} size={42} color="white" />
                    </View>
                  </View>
                </TouchableRipple>
              </LinearGradient>
            </Surface>
          ))}
        </ScrollView>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  surface: {
    elevation: 9,
    borderRadius: scale(10),
    marginHorizontal: scale(10),
    marginVertical: scale(6)
  },

  headerText: {
    marginLeft: scale(10),
    marginBottom: scale(2.5),
    marginTop: scale(10),
    fontSize: scale(23),
    color: "white"
  },

  descriptionText: {
    color: "white",
    fontSize: scale(15),
    paddingLeft: scale(10)
  },

  iconView: {
    marginTop: scale(20),
    marginRight: scale(10),
    marginBottom: scale(10),
    flexDirection: "row",
    justifyContent: "flex-end"
  }
});
