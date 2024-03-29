import * as Calendar from "expo-calendar";

import React, { useEffect, useLayoutEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { showLocation } from "react-native-map-link";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  Avatar,
  Button,
  Card,
  Colors,
  Image,
  Incubator,
  Text,
  View,
} from "react-native-ui-lib";
import Ionicons from "react-native-vector-icons/Ionicons";
import { auth } from "../../../store/firebase";
import {
  updateParticipants,
  updateParticipationRequest,
} from "../../../store/http";
// Avatar Imports
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../store/firebase";
//
import { categoryImage } from "../../../util/categoriesImages";
const { Toast } = Incubator;
// Async Storage to store first time user created
import AsyncStorage from "@react-native-async-storage/async-storage";

// Component
//
//
//
export default function MainEventScreen(props) {
  const eventObject = props.route.params;
  // console.log(eventObject);
  //
  //
  // Date Management
  const date = new Date(eventObject.date);
  console.log(eventObject.date);
  const longDate = date.toLocaleDateString("de-DE").split("-");
  let [day, month, year] = longDate[0].split(".");
  //
  function toWeekdayName(dayNumber) {
    const date = new Date();
    date.setDate(dayNumber);
    return date.toLocaleString("de-DE", {
      weekday: "long",
    });
  }
  //
  function toMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString("de-DE", {
      month: "short",
    });
  }
  // --------------------------------------------------------------------------------
  //
  //
  // Auth Handling
  const user = auth.currentUser;

  // Check if user is already participant of the event
  const [userIsParticipant, setUserIsParticipant] = useState(false);
  const [userIsRequester, setUserIsRequester] = useState(false);
  const [updateState, setUpdateState] = useState(false);
  function checkParticipants() {
    let userIsParticipant = false;

    eventObject.participants.every((participant) => {
      if (participant.userID === user.uid) {
        userIsParticipant = true;
        setUserIsParticipant(true);
        return false;
      } else {
        return true;
      }
    });
    return userIsParticipant;
  }
  function checkRequesters() {
    let userIsRequester = false;

    eventObject.entryRequests.every((requester) => {
      if (requester?.userID === user.uid) {
        userIsRequester = true;
        setUserIsRequester(true);
        return false;
      } else {
        return true;
      }
    });
    return userIsParticipant;
  }
  useEffect(() => {
    checkParticipants();
    checkRequesters();
  }, [userIsParticipant, userIsRequester]);

  const [mapRegion, setMapRegion] = useState({
    latitude: eventObject.coords.latitude,
    longitude: eventObject.coords.longitude,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  });
  function mapPressHandler() {
    props.navigation.goBack();
    props.navigation.navigate("Karte");
    // TODO: Then highlight the pin of the given Event
  }

  // Calendar Handling
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showEventAlreadyCreatedModal, setShowEventAlreadyCreatedModal] =
    useState(false);
  async function getDefaultCalendarSource() {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    return defaultCalendar.source;
  }

  const saveCalendarID = async (id) => {
    try {
      await AsyncStorage.setItem("@eventify_calendar", id);
      console.log("Set AsyncStorage successfully");
      console.log(id);
    } catch (error) {
      // saving error
      console.log(error);
    }
  };
  async function getCalendarID() {
    try {
      const value = await AsyncStorage.getItem("@eventify_calendar");
      return value;
    } catch (error) {
      console.log(error);
    }
  }
  async function createCalendar() {
    const defaultCalendarSource =
      Platform.OS === "ios"
        ? await getDefaultCalendarSource()
        : { isLocalAccount: true, name: "Eventify" };
    const newCalendarID = await Calendar.createCalendarAsync({
      title: "Eventify",
      color: "orange",
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendarSource.id,
      source: defaultCalendarSource,
      name: "internalCalendarName",
      ownerAccount: "personal",
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
    // console.log(`Your new calendar ID is: ${newCalendarID}`);
    saveCalendarID(newCalendarID);
  }

  function calendarHandler() {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );

        const eventifyCalendarId = await getCalendarID();
        let disableCalendarCreation = false;
        for (const index in { calendars }.calendars) {
          if ({ calendars }.calendars[index].id === eventifyCalendarId) {
            disableCalendarCreation = true;
          }
        }
        if (disableCalendarCreation === false) {
          createCalendar();
        }
        // console.log("Calendar already created");
        // console.log(
        //   { calendars }.calendars.filter(
        //     (calendar) => calendar.id === eventifyCalendarId
        //   )
        // );

        const calendarEventDetails = {
          calendarId: eventifyCalendarId,
          id: eventObject.eventId,
          location: `${eventObject.location.name}
          ${eventObject.location.street}, ${eventObject.location.city}`,
          organizer: eventObject.createdBy.userName,
          notes: eventObject.description,
          startDate: `${eventObject.date}T${eventObject.time.slice(
            0,
            5
          )}:00.000Z`,
          endDate: `${eventObject.date}T${
            parseInt(eventObject.time.slice(0, 2)) + 2
          }${eventObject.time.slice(2, 5)}:00.000Z`,
          title: eventObject.title,
          status: Calendar.EventStatus.CONFIRMED,
          timeZone: "UTC+01:00",
          allDay: false,

          availability: Calendar.Availability.BUSY,
        };
        async function createEvent() {
          try {
            const createdEvent = await Calendar.createEventAsync(
              eventifyCalendarId,
              calendarEventDetails
            );
            console.log("created Event");
            return createdEvent;
          } catch (error) {
            console.log(error);
          }
        }
        async function getCalendarEvents() {
          try {
            const test = await Calendar.getEventsAsync(
              [eventifyCalendarId],
              new Date("2022-01-01"),
              new Date("2022-12-12")
            );
            return test;
          } catch (error) {
            console.log(error);
          }
        }
        const currentEvents = await getCalendarEvents();

        // Check if the Event already exists
        let eventAlreadyExists = false;
        currentEvents.forEach((event) => {
          if (event.title === eventObject.title) {
            eventAlreadyExists = true;
          }
        });

        if (!eventAlreadyExists) {
          createEvent();
          setShowCalendarModal(true);
        } else {
          setShowEventAlreadyCreatedModal(true);
        }
      }
    })();
  }

  useEffect(() => {
    // console.log(eventObject);
  }, []);

  // Avatar Handling
  const [avatarOne, setAvatarOne] = useState("");
  const [avatarTwo, setAvatarTwo] = useState("");
  const [avatarThree, setAvatarThree] = useState("");

  useLayoutEffect(() => {
    const avatarOneRef = ref(
      storage,
      "users/" + eventObject.participants[0].userID + "/profilePicture.jpg"
    );

    const avatarTwoRef = ref(
      storage,
      "users/" + eventObject.participants[1]?.userID + "/profilePicture.jpg"
    );

    const avatarThreeRef = ref(
      storage,
      "users/" + eventObject.participants[2]?.userID + "/profilePicture.jpg"
    );
    getDownloadURL(avatarOneRef)
      .then((url) => {
        setAvatarOne(url);
      })
      .catch((error) => {
        console.log(error);
      });
    getDownloadURL(avatarTwoRef)
      .then((url) => {
        setAvatarTwo(url);
      })
      .catch((error) => {
        console.log(error);
      });
    getDownloadURL(avatarThreeRef)
      .then((url) => {
        setAvatarThree(url);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // MAIN RETURN
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <View
          flex
          centerH
          style={{
            overflow: "hidden",
            maxHeight: 250,
            borderBottomLeftRadius: 25,
            borderBottomRightRadius: 25,
          }}
        >
          <View absL marginT-5 style={{ opacity: 0.7, zIndex: 100 }}>
            <Button
              label="<"
              size={Button.sizes.small}
              labelStyle={{ color: Colors.grey10, fontSize: 20 }}
              backgroundColor={Colors.$backgroundDisabled}
              style={{ width: 50 }}
              avoidMinWidth
              onPress={() => props.navigation.goBack()}
            />
          </View>
          <Image
            source={categoryImage[eventObject.category.toLowerCase()]}
            cover
          />
        </View>
        <View flex marginH-15>
          {/* TITEL */}
          <View marginV-15>
            <Text text30BO> {eventObject.title} </Text>
          </View>
          {/* INFO */}
          <View flex row marginB-40>
            <Card
              center
              containerStyle={{
                backgroundColor: Colors.greyBackgroundColor,
                width: 70,
                height: 70,
              }}
            >
              <Text red20 text70BO>
                {`${toMonthName(month)}`}
              </Text>
              <Text text80BO>{`${day}`} </Text>
            </Card>

            <View centerV marginL-5 marginR-35>
              <Text text70BO> {toWeekdayName(day)}</Text>
              <Text> {`${eventObject.time.slice(0, 5)} Uhr`} </Text>
            </View>
            <View flex>
              <Card
                row
                centerV
                flex
                borderRadius={40}
                containerStyle={{ backgroundColor: Colors.greyBackgroundColor }}
              >
                <View flex center>
                  <Text text80L center>
                    Kalendareintrag erstellen
                  </Text>
                </View>
                <View>
                  <Button
                    borderRadius={50}
                    label="+"
                    size={Button.sizes.xSmall}
                    labelStyle={{
                      fontSize: 20,
                    }}
                    backgroundColor={Colors.secondaryColor}
                    avoidMinWidth
                    style={{ width: 50, height: 50 }}
                    onPress={calendarHandler}
                  ></Button>
                </View>
              </Card>
            </View>
          </View>
          {/* DESCRIPTION */}
          <View marginB-30>
            <Text text40BO marginB-10>
              Beschreibung
            </Text>
            <Text grey20>{`${eventObject.description}`}</Text>
          </View>

          {/* LOCATION */}
          <View marginB-10>
            <Text text40BO marginB-10>
              Standort
            </Text>
            <Pressable
              onPress={() => {
                showLocation({
                  latitude: eventObject.coords.latitude,
                  longitude: eventObject.coords.longitude,
                  title: eventObject.location.name,
                  dialogTitle: "Navigation starten",
                  dialogMessage: " ",
                  alwaysIncludeGoogle: true,
                });
              }}
            >
              <View marginL-5>
                <Text grey20 text80BO>
                  {`${eventObject.location.name}`}
                </Text>
                <Text
                  grey20
                  text90
                >{`${eventObject.location.street}, ${eventObject.location.city}`}</Text>
                <Text secondaryColor text100H>
                  Navigation starten
                </Text>
              </View>
            </Pressable>
          </View>
          {/* MAP */}
          <View
            marginB-20
            height={200}
            style={{ borderRadius: 30, overflow: "hidden" }}
          >
            <View>
              <Pressable onPress={mapPressHandler}>
                <MapView
                  pitchEnabled={false}
                  rotateEnabled={false}
                  zoomEnabled={false}
                  scrollEnabled={false}
                  style={{ alignSelf: "stretch", height: "100%" }}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={mapRegion}
                >
                  <Marker
                    pinColor={Colors.secondaryColor}
                    key={eventObject.eventId}
                    coordinate={eventObject.coords}
                  />
                </MapView>
              </Pressable>
            </View>
          </View>
          {/* CREATOR */}
          <View row marginB-30>
            <Avatar
              size={80}
              source={{
                uri: avatarOne,
              }}
              label={"Creator"}
            />
            <View centerV marginL-15 flex>
              <Text text70BO>{eventObject.createdBy.userName}</Text>
              <Text>Organisator</Text>
            </View>
            <View centerV>
              <Button
                avoidMinWidth
                right
                label="Follow"
                labelStyle={{ color: Colors.$backgroundDarkActive }}
                size={Button.sizes.medium}
                backgroundColor={Colors.green50}
                onPress={() => console.log("Add to Follow")}
              />
            </View>
          </View>
        </View>
        <Toast
          visible={showCalendarModal}
          centerMessage
          message="Kalendereintrag erstellt"
          preset="success"
          position={"top"}
          autoDismiss={5000}
          onDismiss={() => setShowCalendarModal(false)}
        ></Toast>
        <Toast
          centerMessage
          visible={showEventAlreadyCreatedModal}
          message="Kalendereintrag existiert bereits"
          preset="failure"
          position={"top"}
          autoDismiss={5000}
          onDismiss={() => setShowEventAlreadyCreatedModal(false)}
        ></Toast>
      </ScrollView>
      <View row>
        <View row flex marginT-5 marginL-20>
          <Pressable
            onPress={() => {
              props.navigation.navigate("participants", {
                participants: eventObject.participants,
                entryRequests: eventObject.entryRequests,
                eventId: eventObject.eventId,
                creator: eventObject.createdBy.userID,
                currentState: updateState,
              });
            }}
          >
            <Text text80BO center>
              Teilnehmer
            </Text>
            {eventObject.participants.length >= 1 ? (
              <Avatar
                containerStyle={{
                  position: "absolute",
                  left: 5,
                  top: 18,
                  zIndex: 1,
                }}
                size={55}
                source={{
                  uri: avatarOne,
                }}
                label={"IT"}
              />
            ) : null}
            {eventObject.participants.length >= 2 ? (
              <Avatar
                containerStyle={{
                  position: "absolute",
                  left: 25,
                  top: 18,
                  zIndex: 2,
                }}
                size={55}
                source={{
                  uri: avatarTwo,
                }}
                label={"IT"}
              />
            ) : null}
            {eventObject.participants.length >= 3 ? (
              <Avatar
                containerStyle={{
                  position: "absolute",
                  left: 45,
                  top: 18,
                  zIndex: 3,
                }}
                size={55}
                source={{
                  uri: avatarThree,
                }}
                label={"IT"}
                badgePosition="BOTTOM_RIGHT"
                badgeProps={{
                  label: `+${
                    eventObject.participants.length > 3
                      ? eventObject.participants.length - 3
                      : 0
                  }`,
                  size: 24,
                  borderWidth: 1.5,
                  borderColor: Colors.$outlineInverted,
                }}
              />
            ) : null}
          </Pressable>
        </View>

        <View flex marginT-15 height={60}>
          {!eventObject.private &&
            (userIsParticipant ? (
              <Button
                label={"Bereits Teilnehmer"}
                disabled={true}
                size={Button.sizes.large}
                borderRadius={15}
                marginH-15
                backgroundColor={Colors.secondaryColor}
                flex
              />
            ) : (
              <Button
                label={"Beitreten"}
                size={Button.sizes.large}
                borderRadius={15}
                disabled={userIsParticipant}
                marginH-15
                backgroundColor={Colors.secondaryColor}
                flex
                onPress={() => {
                  updateParticipants(
                    eventObject.eventId,
                    user.uid,
                    user.displayName
                  );
                  setUserIsParticipant(true);
                }}
              />
            ))}

          {eventObject.private &&
            !userIsParticipant &&
            (!userIsRequester ? (
              <Button
                label={"Anfragen"}
                size={Button.sizes.large}
                borderRadius={15}
                disabled={userIsParticipant}
                marginH-15
                backgroundColor={Colors.secondaryColor}
                flex
                iconSource={() => {
                  return (
                    <Ionicons
                      name="lock-closed-outline"
                      size={24}
                      color="white"
                      style={{ marginRight: 20 }}
                    />
                  );
                }}
                onPress={() => {
                  updateParticipationRequest(
                    eventObject.eventId,
                    user.uid,
                    user.displayName
                  );
                  setUserIsRequester(true);
                }}
              />
            ) : (
              <Button
                label={"Anfrage gesendet"}
                disabled={true}
                size={Button.sizes.large}
                borderRadius={15}
                marginH-15
                backgroundColor={Colors.secondaryColor}
                flex
              />
            ))}
          {userIsParticipant && eventObject.private && (
            <Button
              label={"Bereits Teilnehmer"}
              disabled={true}
              size={Button.sizes.large}
              borderRadius={15}
              marginH-15
              backgroundColor={Colors.secondaryColor}
              flex
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 60,
  },
});
