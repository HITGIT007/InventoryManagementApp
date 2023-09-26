

import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './src/screens/Login';
import { Home } from './src/screens/Home';
import { Inventory } from './src/screens/Inventory';
import {SplashScreen } from './src/screens/Splash';
import Vendor from './src/screens/Vendor';




const Stack = createNativeStackNavigator();

function App(): JSX.Element {
 

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown:false
      }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name='Inventory' component={Inventory} options={{
          headerShown:true
        }} />
        <Stack.Screen name="Vendor" component={Vendor}  options={{
          headerShown:true
        }}/>
      </Stack.Navigator>
    </NavigationContainer>
   
  );
}



export default App;
