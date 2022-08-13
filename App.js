import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
//Navigation
import {
  NavigationContainer,
  DefaultTheme,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/AuthScreens/LoginScreen";
import SignupScreen from "./screens/AuthScreens/SignupScreen";
import WelcomeScreen from "./screens/AuthScreens/WelcomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/MainScreens/HomeScreen";
import SearchScreen from "./screens/MainScreens/SearchScreen";
import MapScreen from "./screens/MainScreens/MapScreen";
import ProfileScreen from "./screens/MainScreens/ProfileScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ProfileCircleSmall from "./components/UI/ProfileCircleSmall";
import LogOut from "./components/UI/LogOut";
// Global Context
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import { useContext, useEffect, useState } from "react";

// Firebase auth
import { auth } from "./store/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import EventCreation from "./screens/MainScreens/EventCreation";
import MapModal from "./components/EventCreation/MapModal";
import FirstTimeUserScreen from "./screens/AuthScreens/FirstTimeUserScreen";

// Async Storage for tracking if we have a first time user
import AsyncStorage from "@react-native-async-storage/async-storage";
// ----------------------------------------------------------------

// Create React Navigation Navigators
const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
// TEMP: Variable to simulate Auth Process to switch between Navigators in Component "Navigator"
const SWITCH_SCREENS = false;
// Drawer Navigator for HomeScreen

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "transparent",
          borderBottomWidth: 1,
        },
        headerTitle: "",
        drawerActiveTintColor: "#FAA353",
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerLeft: (props) => (
            <ProfileCircleSmall
              {...props}
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          ),
          // drawerItemStyle: { height: 0 }, // Hide a Drawer Item from showing inside Drawer
        })}
      />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Log Out" component={LogOut} />
    </Drawer.Navigator>
  );
}
// Bottom Navigator Tabs
function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home-Drawer") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Map") {
            iconName = focused ? "map" : "map-outline";
          }
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FAA353",
        tabBarInactiveTintColor: "gray",
        tabBarOptions: {
          style: {
            backgroundColor: "#dd2e2e",
            position: "absolute",
            bottom: 0,
            padding: 10,
            // width: DEVICE_WIDTH,
            height: 54,
          },
        },
        tabBarStyle: {
          borderWidth: 0.5,
          borderBottomWidth: 1,
          backgroundColor: "white",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderColor: "transparent",
          overflow: "hidden",
          position: "absolute",
          zIndex: 8,
        },
      })}
    >
      <BottomTab.Screen
        name="Home-Drawer"
        component={DrawerNavigator}
        options={{ tabBarBadge: 3, tabBarLabel: "Home" }} // TODO: Connect to something relevant?
      />
      <BottomTab.Screen name="Search" component={SearchScreen} />
      <BottomTab.Screen name="Map" component={MapScreen} />
      <BottomTab.Screen name="TESTING" component={FirstTimeUserScreen} />
    </BottomTab.Navigator>
  );
}

// Registration & Login Screens
function AuthenticationProcess() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" component={WelcomeScreen} />
      <Stack.Screen name="signup" component={SignupScreen} />
      <Stack.Screen name="login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

// Screens after being authenticated by Firebase
function AuthenticatedStack() {
  const navigation = useNavigation();

  // Initially the user is NOT a first time user. We set the AsyncStorage Variable to "1", when creating a user (Check SignupScreen.js)
  // Check if the data in the AsyncStorage under the key "@first_time_user" is not null, then we have a first time User
  async function getFirstimeUser() {
    try {
      const value = await AsyncStorage.getItem("@first_time_user");
      if (value !== null && value !== "0") {
        navigation.navigate("firstTimeUser");
      }
    } catch (error) {
      console.log(error);
    }
  }
  // When ever starting the app for the first time, we check if the user is a first time user.
  // We store the value we check in a async storage, so it persists after restarting the app (local storage)
  useEffect(() => {
    getFirstimeUser();
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="bottomTabs" component={BottomTabNavigator} />
      <Stack.Screen name="firstTimeUser" component={FirstTimeUserScreen} />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="eventCreation" component={EventCreation} />
        <Stack.Screen name="eventCreationMap" component={MapModal} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

// Switch between AuthenticationProcess & AuthenticatedStack, if the User is authenticated. This makes it impossible to get to main screens without
// beeing registered.

// Theme Config for Global Background Color
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white",
  },
};
function Navigation() {
  const authCtx = useContext(AuthContext);
  return (
    <NavigationContainer theme={MyTheme}>
      {!authCtx.isSignedIn && <AuthenticationProcess />}
      {authCtx.isSignedIn && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

// Main Execution of the App
export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AuthContextProvider>
        <Navigation />
      </AuthContextProvider>
    </>
  );
}
