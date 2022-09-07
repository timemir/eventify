import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import "react-native-gesture-handler";
//Navigation
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DefaultTheme,
  NavigationContainer,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import LogOut from "./components/UI/LogOut";
import ProfileCircleSmall from "./components/UI/ProfileCircleSmall";
import LoginScreen from "./screens/AuthScreens/LoginScreen";
import SignupScreen from "./screens/AuthScreens/SignupScreen";
import WelcomeScreen from "./screens/AuthScreens/WelcomeScreen";
import HomeScreen from "./screens/MainScreens/HomeScreen";
import MapScreen from "./screens/MainScreens/MapScreen";
import ProfileScreen from "./screens/MainScreens/ProfileScreen";
import SearchScreen from "./screens/MainScreens/SearchScreen";
import EditProfileScreen from "./screens/SettingsScreens/EditProfileScreen";
// Global Context
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import AuthContextProvider, { AuthContext } from "./store/auth-context";

// Firebase auth
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import MapModal from "./components/EventCreation/MapModal";
import FirstTimeUserScreen from "./screens/AuthScreens/FirstTimeUserScreen";
import EventCreation from "./screens/MainScreens/EventCreation";
import { auth } from "./store/firebase";
// Notification
import registerNNPushToken from "native-notify";

// Async Storage for tracking if we have a first time user
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainEventScreen from "./components/UI/HomeScreen/MainEventScreen";
import ParticipantsList from "./components/UI/ParticipantsList";
import EventChat from "./screens/ChatScreens/EventChat";
import ChatScreen from "./screens/MainScreens/ChatScreen";
import UserProfileScreen from "./screens/MainScreens/UserProfileScreen";
import AdminDashboard from "./screens/SettingsScreens/AdminDashboard";
import ManageEventDetails from "./screens/SettingsScreens/AdminScreens/ManageEventDetails";
import ManageEvents from "./screens/SettingsScreens/AdminScreens/ManageEvents";
import ManagePush from "./screens/SettingsScreens/AdminScreens/ManagePush";
import ManagePushAll from "./screens/SettingsScreens/AdminScreens/ManagePushAll";
import ManagePushIndi from "./screens/SettingsScreens/AdminScreens/ManagePushIndi";
import ManageUserDetails from "./screens/SettingsScreens/AdminScreens/ManageUserDetails";
import ManageUsers from "./screens/SettingsScreens/AdminScreens/ManageUsers";
import UserSettings from "./screens/SettingsScreens/UserSettings";
// ----------------------------------------------------------------

// Create React Navigation Navigators
const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Drawer Navigator for HomeScreen
function DrawerNavigator() {
  const user = auth.currentUser;

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
          headerTitle: `Willkommen, ${user.displayName?.split(" ")[0]}!`,
          // drawerItemStyle: { height: 0 }, // Hide a Drawer Item from showing inside Drawer
        })}
      />
      <Drawer.Screen
        name="Profil"
        component={ProfileScreen}
        options={({ route }) => ({
          headerRight: (props) => <Text {...props}></Text>,
        })}
      />
      <Drawer.Screen name="Einstellungen" component={UserSettings} />
      {user.email === "admin@admin.com" && (
        <Drawer.Screen name="Admin Dashboard" component={AdminDashboard} />
      )}
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
          } else if (route.name === "Suche") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Karte") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "Chats") {
            iconName = focused
              ? "chatbubble-ellipses"
              : "chatbubble-ellipses-outline";
          }
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FAA353",
        tabBarInactiveTintColor: "gray",
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
      <BottomTab.Screen name="Suche" component={SearchScreen} />
      <BottomTab.Screen name="Karte" component={MapScreen} />
      <BottomTab.Screen name="Chats" component={ChatScreen} />
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
      <Stack.Screen name="mainEventScreen" component={MainEventScreen} />
      <Stack.Screen name="editProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="userProfileScreen" component={UserProfileScreen} />
      <Stack.Screen name="manageUsers" component={ManageUsers} />
      <Stack.Screen name="manageUserDetails" component={ManageUserDetails} />
      <Stack.Screen name="manageEvents" component={ManageEvents} />
      <Stack.Screen name="manageEventDetails" component={ManageEventDetails} />
      <Stack.Screen name="managePush" component={ManagePush} />
      <Stack.Screen name="managePushAll" component={ManagePushAll} />
      <Stack.Screen name="managePushIndi" component={ManagePushIndi} />
      <Stack.Screen name="eventChat" component={EventChat} />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="eventCreation" component={EventCreation} />
        <Stack.Screen name="eventCreationMap" component={MapModal} />
        <Stack.Screen name="participants" component={ParticipantsList} />
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

  // Authentication
  const [user, setUser] = useState(null);

  useLayoutEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.email === "admin@admin.com") {
          authCtx.setAdmin();
        }
      } else {
        // User is signed out
        setUser(null);
      }
    });
  }, [auth]);

  return (
    <NavigationContainer theme={MyTheme}>
      {!user && <AuthenticationProcess />}
      {user && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

// Main Execution of the App
export default function App() {
  registerNNPushToken(3719, "xT0Bt22NitQhc3dS8WidSr");

  return (
    <>
      <StatusBar style="auto" />
      <AuthContextProvider>
        <Navigation />
      </AuthContextProvider>
    </>
  );
}
