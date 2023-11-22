import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Home from './Screens/Home'; 
import Connection from './Screens/Connection';
import ListCards from './Screens/ListCards'; // import your new screen
import ListCategories from './Screens/ListCategories';
import ListTypes from './Screens/ListTypes';
import { useDispatch } from 'react-redux';
import { updateCumulativePaths } from './Store/dataSlice';
import { useEffect } from 'react';
import Lab07 from './Screens/lab264/Lab07/Lab07';
import Lab02 from './Screens/lab264/Lab02';


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerNavigator = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updateCumulativePaths());
  }, [])
 
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Connection manager" component={Connection} />
      <Drawer.Screen name="Categories" component={ListCategories} />
      <Drawer.Screen name="Types" component={ListTypes} />
    </Drawer.Navigator>
  );
};


const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="DrawerNavigator">
      <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} options={{headerShown: false}} />
      <Stack.Screen name="ListCards" component={ListCards} />
      <Stack.Screen name="Lab07" component={Lab07} />
      <Stack.Screen name="Lab02" component={Lab02} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
