import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
//Navigation
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
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
import { useContext } from "react";

// Firebase auth
import { auth } from "./store/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
      })}
    >
      <BottomTab.Screen
        name="Home-Drawer"
        component={DrawerNavigator}
        options={{ tabBarBadge: 3, tabBarLabel: "Home" }} // TODO: Connect to something relevant?
      />
      <BottomTab.Screen name="Search" component={SearchScreen} />
      <BottomTab.Screen name="Map" component={MapScreen} />
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
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="bottomTabs" component={BottomTabNavigator} />
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
