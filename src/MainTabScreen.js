import React from 'react'
import { View, Alert, StyleSheet,Text, Image} from "react-native";

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';

import HomeScreen from './HomeScreen';
import NotificationScreen from './NotificationScreen';
import ProfileScreen from "./ProfileScreen";
import MenuScreen from './MenuScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'CMMS.db' });

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackScreen() {


    
    return (
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#42A5F5' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
          }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Evantage  C M M S',

            headerLeft: () => ( 
                <Image style={styles.image} source={require('../images/logo.png.png')}/>
            ),
    
            headerRight: () => (
                <AntDesign name="logout" color="#FFF" size={25} style={{marginRight:20}}/>
            ) 
            
            }}/>
         
        </Stack.Navigator>
    );
}

function MenuScreenStackScreen() {
    return (
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#42A5F5' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
          }}>
          <Stack.Screen
            name="Details"
            component={MenuScreen}
            options={{ title: 'Evantage  C M M S',

            headerLeft: () => ( 
                <Image style={styles.image} source={require('../images/logo.png.png')}/>
            ),
    
            headerRight: () => (
                <AntDesign name="logout" color="#FFF" size={25} style={{marginRight:20}}/>
            ) 
            
            }}/>
         
        </Stack.Navigator>
    );
}

function NotificationStackScreen() {
    return (
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#42A5F5' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
          }}>
          <Stack.Screen
            name="Details"
            component={NotificationScreen}
            options={{ title: 'Evantage  C M M S',

            headerLeft: () => ( 
                <Image style={styles.image} source={require('../images/logo.png.png')}/>
            ),
    
            headerRight: () => (
                <AntDesign name="logout" color="#FFF" size={25} style={{marginRight:20}}/>
            ) 
            
            }}/>
         
        </Stack.Navigator>
    );
}

function ProfileStackScreen() {
    return (
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#42A5F5' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
          }}>
          <Stack.Screen
            name="Details"
            component={ProfileScreen}
            options={{ title: 'Evantage  C M M S',

            headerLeft: () => ( 
                <Image style={styles.image} source={require('../images/logo.png.png')}/>
            ),
    
            headerRight: () => (
                <AntDesign name="logout" color="#FFF" size={25} style={{marginRight:20}}/>
            )
        
            
            }}/>
         
        </Stack.Navigator>
    );
}

const MainTabScreen = () => {
    
    return (
       
        <Tab.Navigator
            initialRouteName="Feed"
            screenOptions={{
                tabBarActiveTintColor:'#8cebff',
                tabBarInactiveTintColor:'#fff',
            tabBarStyle: {
                backgroundColor: '#0096FF',
               
               
              }
          
            }}>
            <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                    <Icon name="home" color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name="MenuScreen"
                component={MenuScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Menu',
                    tabBarIcon: ({ color, size }) => (
                    <AntDesign name="appstore-o" color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name="NotificationScreen"
                component={NotificationScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Notification',
                    tabBarIcon: ({ color, size }) => (
                    <Icon name="bell" color={color} size={size} />
                    ),
                }}
            />


            <Tab.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                    <Icon name="face-man-profile" color={color} size={size} />
                    ),
                }}
            />
        
        </Tab.Navigator>
   
    );
}

export default MainTabScreen;

const styles = StyleSheet.create({ 
    image: {
        width: 30,
        height: 30,        
        resizeMode: 'contain',
        marginLeft:10

    }, 

});