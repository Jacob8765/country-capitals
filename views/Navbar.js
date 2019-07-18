import React from "react";
import { Feather } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import { scale } from "../functions/AutoScale";

export default class Navbar extends React.Component {
  render() {
    return (
      <View style={[styles.header, { justifyContent: this.props.showBackButton ? "space-between" : "flex-end" }]}>
        {this.props.showBackButton ? <Feather name="arrow-left" size={scale(28)} style={{ marginLeft: scale(-4) }} color={this.props.darkTheme ? "#EEEEEE" : "black"} onPress={() => this.props.navigation.goBack()} /> : null}
        {this.props.showSettingsButton ? <Feather name="settings" size={scale(28)} color={this.props.darkTheme ? "#EEEEEE" : "black"} onPress={() => this.props.navigation.navigate("Settings")} /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    margin: scale(10),
    marginTop: scale(38),
    flexDirection: "row"
  }
});
