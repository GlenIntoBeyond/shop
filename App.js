/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import CartScreen from './src/screens/CartScreen';
import ProductScreen from './src/screens/ProductScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';

import colors from './src/utils/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const tabColor = (focused) => {
  return focused ? colors.primary : colors.inactiveTab;
}
    
const ProductNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName='Product'
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen 
        name="Product" 
        component={ProductScreen}
        options={{
          title: 'Products',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
        />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen} 
        options={({ route }) => ({
          title: route.params.name,
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
        />
    </Stack.Navigator>
  );
}

const CartNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName='Cart'
      screenOptions={{
        headerShown: true
      }}
    >
      <Stack.Screen 
        name="Cart" 
        component={CartScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
        />
    </Stack.Navigator>
  );
}


const App: () => Node = () => {

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="ProductNavigator"
        activeColor={colors.primary}
        inactiveColor={colors.inactiveTab}
        barStyle={{ backgroundColor: colors.white }}
      >
        <Tab.Screen 
          name="ProductNavigator" 
          component={ProductNavigator} 
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcon style={[{ color: tabColor(focused) }]} size={hp(3.5)} name={'home'} />
            ),
            tabBarLabel: 'Home',
          }}
        />
        <Tab.Screen 
          name="CartNavigator" 
          component={CartNavigator} 
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcon style={[{ color: tabColor(focused) }]} size={hp(3.5)}  name={'cart'} />
            ),
            tabBarLabel: 'Cart',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};


export default App;
