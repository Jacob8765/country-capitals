import { Dimensions } from "react-native";

const initialWidth = 797;
const initialHeight = 411;
const { width, height } = Dimensions.get("window");

module.exports.scale = size => {
  let percentOfInitial = size / (initialWidth + initialHeight);
  return percentOfInitial * (width + height);
};
