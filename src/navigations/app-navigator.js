import { createBottomTabNavigator } from 'react-navigation-tabs';
import React from 'react'
import HomeScreen from '../scenes/home';
import ControlPanel from '../scenes/controlPanel';
import Settings from '../scenes/settings';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const TabNavigatorConfig = {
  initialRouteName: 'Home',
  header: null,
  headerMode: 'none',
  showIcon: true,
  showLabel: false,
  tabBarOptions: {
    activeTintColor: 'brown', // change
    style: {
      backgroundColor: 'black',
      borderTopWidth: 0,
      width: '100%',
      height: hp('11%'),
    },
    labelStyle:
    {
      fontSize: hp('2.5%'),
      fontFamily: "kohinoor",
      paddingBottom: hp('4.8%')
    }
  }
};
const RouteConfigs = {
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: 'Device'
    }
  },
  ControlPanel: {
    screen: ControlPanel,
    navigationOptions: {
      tabBarLabel: 'Control Panel'
    }
  },
  Settings: {
    screen: Settings,
  }
};

const AppNavigator = createBottomTabNavigator(RouteConfigs, TabNavigatorConfig);

export default AppNavigator;
