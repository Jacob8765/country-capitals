import React from "react";
import { View, StyleSheet, AsyncStorage } from "react-native";
import { Switch, Text, Divider } from "react-native-paper";
import { WebBrowser } from "expo";
import Navbar from "./Navbar";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  item: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingVertical: 20,
    marginTop: 10
  }
});

export default class Settings extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      darkTheme: "false"
    };

    this.getItem("darkTheme");
  }

  setItem = async item => {
    const value = this.state[item] == "true" ? "false" : "true";
    this.setState({ [item]: value });

    try {
      await AsyncStorage.setItem(item, value, (err, result) => {
        if (err) throw err;
      });
    } catch (err) {}
  };

  getItem = async item => {
    try {
      await AsyncStorage.getItem(item).then(result => {
        this.setState({ [item]: result == "true" ? "true" : "false", loading: false });
      });
    } catch (err) {
      console.log(err);
    }
  };

  openPrivacyPolicy = () => {
    WebBrowser.openBrowserAsync("https://gist.github.com/Jacob8765/bf63b69b66412d6c60a6c910a97d2471");
  };

  render() {
    if (!this.state.loading) {
      return (
        <View style={[styles.container, { backgroundColor: this.state.darkTheme == "true" ? "#212121" : "white" }]}>
          <Navbar showBackButton={true} showSettingsButton={false} navigation={this.props.navigation} darkTheme={this.state.darkTheme == "true" ? true : false} />

          <View style={styles.item}>
            <Text style={{ fontSize: 20, color: this.state.darkTheme == "true" ? "white" : "black" }}>Dark theme</Text>
            <Switch value={this.state.darkTheme == "true" ? true : false} onValueChange={() => this.setItem("darkTheme")} />
          </View>

          <Divider />

          <Text style={{ color: this.state.darkTheme == "true" ? "white" : "blue", padding: 10, paddingVertical: 20, fontSize: 15 }} onPress={this.openPrivacyPolicy}>
            Privacy policy
          </Text>
        </View>
      );
    } else {
      return null;
    }
  }
}
