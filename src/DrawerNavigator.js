import { createDrawerNavigator } from '@react-navigation/drawer';

import FirstLevelScreen from './Screens/FirstLevelScreen'; 
import Connection from './Screens/Connection';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="FirstLevelScreen">
      <Drawer.Screen name="ConnectionScreen" component={Connection} />

      <Drawer.Screen name="FirstLevelScreen" component={FirstLevelScreen} />
      
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;