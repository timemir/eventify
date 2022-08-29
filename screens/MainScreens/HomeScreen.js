import axios from "axios";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Platform, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
// RNUILib
import {
  Button,
  Card,
  Carousel,
  Colors,
  ExpandableSection,
  Icon,
  Spacings,
  Text,
  View,
} from "react-native-ui-lib";
import EventSection from "../../components/UI/HomeScreen/EventSection";
import loadFoundationConfig from "../../RNUILib/FoundationConfig";
import { GlobalStyles } from "../../util/GlobalColors";

// http helper functions
import { fetchAllCategories, fetchAllEvents } from "../../store/http";
// Navigation
import { useIsFocused } from "@react-navigation/native";
import { auth } from "../../store/firebase";

loadFoundationConfig();
export default function HomeScreen(props) {
  //
  // State for all Events
  const [fetchedCategories, setFetchedCategories] = useState([]);
  // All Events as an Object inside an Array -> [{ }, { }, { }]
  const [fetchedEvents, setFetchedEvents] = useState([]);
  // React Navigation Hook
  const isFocused = useIsFocused();

  // Fetch all Categories
  useLayoutEffect(() => {
    async function getCategories() {
      const categories = await fetchAllCategories();
      setFetchedCategories(categories);
    }
    getCategories();
  }, []);

  // Fetch all Events
  useLayoutEffect(() => {
    // Rerun useEffect Function if we re-enter the HomeScreen
    if (isFocused) {
      const user = auth.currentUser;
      // Helper Function, because we cannot set useEffect function as async. not allowed!
      async function getEvents() {
        const events = await fetchAllEvents();
        setFetchedEvents(events);
      }
      getEvents();

      // DO NOT PUT ANYTHING OUTSIDE IF STATEMENT!
    }
  }, [isFocused]);

  // Managing Notifications -----------------------------------------------------
  // Notification Permission
  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }
  // Notification Handling
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Pass on device token for the notification to somewhere

  // Function that creates a local notification
  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: "Here is the notification body",
        data: { data: "goes here" },
      },
      trigger: { seconds: 5 },
    });
  }

  // MAIN RETURN
  return (
    <SafeAreaView>
      {/* BUBBLES */}
      <View
        absT
        height={300}
        width={"100%"}
        style={{
          overflow: "hidden",
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          // backgroundColor: "#eee2e2",
        }}
      >
        <View
          abs
          style={{
            left: -5,
            top: -110,
            zIndex: 1,
            backgroundColor: Colors.bubbleColor,
          }}
          borderRadius={180}
          width={360}
          height={360}
        />
        <View
          abs
          style={{
            right: -90,
            top: -90,
            zIndex: 2,
            backgroundColor: Colors.bubbleColorTertiary,
          }}
          borderRadius={160}
          width={320}
          height={320}
        />
        <View
          abs
          style={{
            left: -50,
            top: 65,
            zIndex: 2,
            backgroundColor: Colors.bubbleColorSecondary,
          }}
          borderRadius={65}
          width={130}
          height={130}
        />
      </View>
      <ScrollView style={{ marginBottom: 45 }}>
        {/* RENDER EVENT CREATION MODAL: */}
        <View>
          <Button
            label="Send Local Notification"
            onPress={async () => {
              await schedulePushNotification();
            }}
          />
          <Button
            label="Send Push Notification"
            onPress={async () => {
              try {
                const response = await axios.post(
                  "https://expo.host/--/api/v2/push/send",
                  {
                    to: expoPushToken,
                    title: "Test",
                    body: "This is a test notification",
                  },
                  {
                    headers: {
                      host: "exp.host",
                      accept: "application/json",
                      "accept-encoding": "gzip",
                      "content-type": "application/json",
                    },
                  }
                );
                console.log(response);
              } catch (error) {
                console.log(error);
              }
            }}
          />
          <Card
            row
            center
            flex
            height={160}
            style={{
              marginBottom: 15,
              marginTop: 15,
              backgroundColor: Colors.secondaryColor,
            }}
            onPress={() =>
              props.navigation.navigate("eventCreation", fetchedCategories)
            }
            borderRadius={15}
            activeOpacity={1}
          >
            <Card.Section
              imageSource={require("../../assets/images/guyOnChair.png")}
              imageStyle={{ width: 115, height: "100%" }}
            />

            <View flex center>
              <Text text60BO white>
                Neues Event erstellen
              </Text>
              <Text center style={{ marginHorizontal: 20 }} grey60 text90>
                Organisiere deine eigenen Events
              </Text>
            </View>
            <Ionicons
              name={"arrow-forward-outline"}
              size={34}
              color={"white"}
            />
          </Card>
        </View>
        {/* RENDER STADTDORTMUND SECTION: */}
        <View marginB-40>
          {fetchedCategories.map((categoryName, index) => {
            if (categoryName.toLowerCase() === "stadtdortmund") {
              return (
                <EventSection
                  key={index}
                  sectionName={categoryName}
                  highlight={true}
                  categoryEventData={() => {
                    const eventsListByCategory = [];

                    fetchedEvents.forEach((item) => {
                      if (item.category === categoryName) {
                        eventsListByCategory.push(item);
                      }
                    });

                    return eventsListByCategory;
                  }}
                ></EventSection>
              );
            } else {
              return;
            }
          })}
        </View>
        {/* RENDER CATEGORY SECTIONS: */}
        {fetchedCategories.map((categoryName, index) => {
          if (categoryName.toLowerCase() === "stadtdortmund") {
            return;
          } else {
            return (
              <EventSection
                key={index}
                sectionName={categoryName}
                categoryEventData={() => {
                  const eventsListByCategory = [];

                  fetchedEvents.forEach((item) => {
                    if (item.category === categoryName) {
                      eventsListByCategory.push(item);
                    }
                  });

                  return eventsListByCategory;
                }}
              ></EventSection>
            );
          }
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
