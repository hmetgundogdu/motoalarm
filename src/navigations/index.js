import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import AppNavigator from './app-navigator';

const RootNavigator = createSwitchNavigator(
  {
    App: AppNavigator,
    
  },
  {
    initialRouteName: 'App',
    style: {
      fontSize: 25,
      backgroundColor: 'red'
    }
  },

);

export default createAppContainer(RootNavigator);
