import React from "react";
import { Feather } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

export default class Navbar extends React.Component {
  render() {
    return (
      <View style={[styles.header, { justifyContent: this.props.showBackButton ? "space-between" : "flex-end" }]}>
        {this.props.showBackButton ? <Feather name="arrow-left" size={28} style={{ marginLeft: -4 }} color={this.props.darkTheme ? "#EEEEEE" : "black"} onPress={() => this.props.navigation.goBack()} /> : null}
        {this.props.showSettingsButton ? <Feather name="settings" size={28} color={this.props.darkTheme ? "#EEEEEE" : "black"} onPress={() => this.props.navigation.navigate("Settings")} /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    margin: 10,
    marginTop: 30,
    flexDirection: "row"
  }
});
