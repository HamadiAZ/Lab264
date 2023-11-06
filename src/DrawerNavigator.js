import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomScreen from './Screens/CustomScreen'; // Create this component
import FirstLevelScreen from './Screens/FirstLevelScreen'; // Create this component

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="FirstLevelScreen">
      <Drawer.Screen name="Custom" component={CustomScreen} />
      <Drawer.Screen name="FirstLevelScreen" component={FirstLevelScreen} />
      
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;