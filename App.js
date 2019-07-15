import Home from "./views/Home";
import Settings from "./views/Settings";
import GameView from "./views/GameView";
import { createStackNavigator, createAppContainer } from "react-navigation";

const AppNavigator = createStackNavigator(
  {
    Home: { screen: Home },
    Settings: { screen: Settings },
    GameView: { screen: GameView }
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
);

export default createAppContainer(AppNavigator);
