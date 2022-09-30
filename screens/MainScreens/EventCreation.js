import React, { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Button,
  Card,
  Checkbox,
  Colors,
  Constants,
  DateTimePicker,
  Incubator,
  LoaderScreen,
  Picker,
  Text,
  Toast,
  View,
} from "react-native-ui-lib";
import Ionicons from "react-native-vector-icons/Ionicons";
// Maps

import MapView from "react-native-maps";
// Firebase Auth

import { auth } from "../../store/firebase";
// Axios - HTTP Request
import axios from "axios";
import { updateCreatedEventsByUser } from "../../store/http";
// Global Auth Context
import { AuthContext } from "../../store/auth-context";
// Incubators are experimental Components from RNUILib
const { TextField } = Incubator;

// Main Function Component
export default function EventCreation(props) {
  // Creation of states (Data that gets send to the event object for event creation)
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [googleMapsData, setgoogleMapsData] = useState({
    name: undefined,
    street: undefined,
    city: undefined,
  });
  const [mapRegion, setMapRegion] = useState({
    latitude: 51.512408,
    longitude: 7.466741,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [mapMarker, setMapMarker] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [privatStatus, setPrivatStatus] = useState(false);
  // HTTP POST State
  const [httpPosting, setHttpPosting] = useState(false);
  // Final Validation State
  const [finalValidationFailed, setFinalValidationFailed] = useState(false);
  const [checkAllEntries, setCheckAllEntries] = useState(false);

  // Getting the Context to check if the user is an admin
  const authCtx = useContext(AuthContext);

  // Listener to be able to send Map Data from Big Map back to Event Creation Screen
  useEffect(() => {
    props.navigation.addListener("focus", () => {});
  }, []);

  // Final Validation for the Button
  useEffect(() => {
    if (
      title !== "" &&
      category !== "" &&
      time !== "" &&
      date !== "" &&
      googleMapsData?.name !== undefined
    ) {
      setCheckAllEntries(false);
    } else {
      setCheckAllEntries(true);
    }
  }, [title, category, time, date, googleMapsData]);

  // ----------------------------------------------------------------
  // Checking if user is signed in to get userID

  const user = auth.currentUser;

  // Navigation params passed from HomeScreen
  const fetchedCategories = props.route.params;
  // Filtering fetchedCategories: Do not include "stadtDORTMUND", if you are not an admin
  const filteredCategories = fetchedCategories.reduce(function (
    result,
    category
  ) {
    if (authCtx.adminStatus) {
      result.push(category);
    } else {
      if (category.toLowerCase() !== "stadtdortmund") {
        result.push(category);
      }
    }
    return result;
  },
  []);

  // Rendering of the component
  return (
    <KeyboardAwareScrollView>
      <View flex padding-20>
        {/* Render LoaderScreen when we are Creating a new event*/}
        {httpPosting && (
          <View flex padding-200>
            <LoaderScreen message={"Creating Event..."} color={Colors.grey40} />
          </View>
        )}
        <View row>
          <Ionicons
            onPress={() => props.navigation.goBack()}
            name="arrow-back-outline"
            size={24}
            color={Colors.secondaryColor}
            style={{ marginRight: 20 }}
          />
          <Text text40 grey20 marginB-30 center>
            Event Erstellung
          </Text>
        </View>
        {/* Inputfield - Event title */}
        <Card
          row
          padding-10
          height={80}
          center
          marginB-20
          style={{ backgroundColor: Colors.greyBackgroundColor }}
        >
          <TextField
            autoCapitalize={"sentences"}
            placeholder="Wie soll dein Event heißen?"
            floatingPlaceholder
            floatingPlaceholderStyle={{
              color: "grey",
              opacity: 0.6,
              width: "100%",
            }}
            value={title}
            onChangeText={(item) => setTitle(item)}
            containerStyle={{ flexGrow: 1 }}
            fieldStyle={styles.withUnderline}
            color={Colors.secondaryColor}
            enableErrors
            validationMessage="Bitte gib einen Event Titel an."
            validationMessagePosition="bottom"
            validate="required"
            validateOnBlur
            leadingAccessory={
              <Ionicons
                name="reader-outline"
                size={24}
                color="grey"
                style={{ marginRight: 20 }}
              />
            }
          />
        </Card>
        {/* ---------------------------------------------------------------- */}
        {/* Inputfield - Event category */}
        <Card
          row
          padding-10
          marginB-20
          height={80}
          centerV
          style={{ backgroundColor: Colors.greyBackgroundColor }}
        >
          <Ionicons
            name="grid-outline"
            size={24}
            color="grey"
            style={{ marginRight: 20 }}
          />
          <Picker
            placeholder="In welcher Kategorie soll dein Event sein?"
            floatingPlaceholder
            floatingPlaceholderStyle={{
              color: "grey",
              opacity: 0.6,
              width: "100%",
            }}
            value={category}
            enableModalBlur={false}
            onChange={(item) => setCategory(item)}
            topBarProps={{ title: "Kategorien", useSafeArea: true }}
            migrateTextField
            style={{
              color: Colors.secondaryColor,
              fontSize: 18,
            }}
            fieldStyle={{ width: 300 }}
            showSearch
            useSafeArea={true}
            searchPlaceholder={"Such eine Kategorie"}
            searchStyle={{
              color: "#FAA353",
              placeholderTextColor: Colors.grey20,
            }}
          >
            {filteredCategories.map((option, index) => {
              return <Picker.Item key={index} value={option} label={option} />;
            })}
          </Picker>
        </Card>
        {/* ---------------------------------------------------------------- */}
        {/* Inputfield - Event date */}
        <Card
          row
          padding-10
          height={80}
          centerV
          marginB-20
          style={{ backgroundColor: Colors.greyBackgroundColor }}
        >
          <Ionicons
            name="calendar-outline"
            size={24}
            color="grey"
            style={{ marginRight: 20 }}
          />
          <View flex centerH>
            <DateTimePicker
              placeholder={"Wähle ein Datum für das Event aus"}
              mode={"date"}
              display="calendar"
              color={Colors.secondaryColor}
              containerStyle={{ height: 30, width: "100%" }}
              value={date}
              onChange={(value) => {
                setDate(value);
              }}
            />
          </View>
        </Card>
        {/* ---------------------------------------------------------------- */}
        {/* Inputfield - Event time */}
        <Card
          row
          padding-10
          height={80}
          centerV
          marginB-20
          style={{ backgroundColor: Colors.greyBackgroundColor }}
        >
          <Ionicons
            name="time-outline"
            size={24}
            color="grey"
            style={{ marginRight: 20 }}
          />
          <View flex centerH>
            <DateTimePicker
              placeholder={"Wähle eine Uhrzeit für das Event aus"}
              mode={"time"}
              color={Colors.secondaryColor}
              containerStyle={{ height: 30 }}
              timeFormat={"HH:mm"}
              minuteInterval={5}
              is24Hour={true}
              value={time}
              onChange={(value) => {
                setTime(value);
              }}
            />
          </View>
        </Card>
        {/* ---------------------------------------------------------------- */}

        {/* Inputfield - Small Map */}
        <Pressable
          onPress={() => {
            props.navigation.navigate("eventCreationMap", {
              mapRegion: mapRegion,
              onReturn: (mapsData, mapsCoords) => {
                setgoogleMapsData(mapsData);
                setMapRegion({
                  latitude: mapsCoords.latitude,
                  longitude: mapsCoords.longitude,
                  latitudeDelta: mapsCoords.latitudeDelta,
                  longitudeDelta: mapsCoords.latitudeDelta,
                });
                setMapMarker({
                  latitude: mapsCoords.latitude,
                  longitude: mapsCoords.longitude,
                });
              },
            }); // Alternative way of making the big map
            // setDialogState(true);
          }}
        >
          <Card
            row
            padding-10
            height={160}
            centerV
            marginB-20
            style={{ backgroundColor: Colors.greyBackgroundColor }}
          >
            <Ionicons
              name="map-outline"
              size={24}
              color="grey"
              style={{ marginRight: 20 }}
            />

            <View flex centerH>
              <MapView
                pitchEnabled={false}
                rotateEnabled={false}
                zoomEnabled={false}
                scrollEnabled={false}
                style={{ alignSelf: "stretch", height: "100%" }}
                region={mapRegion}
                provider="google"
              />
            </View>
          </Card>
        </Pressable>
        {/* Map Data after Selection */}
        {googleMapsData.name !== undefined && (
          <Card
            row
            padding-10
            height={160}
            centerV
            marginB-20
            style={{ backgroundColor: Colors.greyBackgroundColor }}
          >
            <Ionicons
              name="pin-outline"
              size={24}
              color="grey"
              style={{ marginRight: 20 }}
            />

            <View flex centerH>
              <Text>{`${googleMapsData?.name}`}</Text>
              <Text>{`${googleMapsData?.street}`}</Text>
              <Text>{`${googleMapsData?.city}`}</Text>
            </View>
          </Card>
        )}
        {/* Inputfield - Description  */}

        <Card
          row
          padding-10
          height={160}
          centerV
          marginB-20
          style={{ backgroundColor: Colors.greyBackgroundColor }}
        >
          <Ionicons
            name="newspaper-outline"
            size={24}
            color="grey"
            style={{ marginRight: 20 }}
          />

          <View flex centerH>
            <TextField
              placeholder={"Schreibe eine kurze Beschreibung"}
              onChangeText={(text) => setDescription(text)}
              showCharCounter
              multiline
              maxLength={150}
              style={{
                height: 100,
                minWidth: "100%",
              }}
            />
          </View>
        </Card>
        {/* Inputfield - Privat Status  */}

        <Card
          row
          padding-10
          height={80}
          centerV
          marginB-20
          style={{ backgroundColor: Colors.greyBackgroundColor }}
        >
          <Ionicons
            name="lock-closed-outline"
            size={24}
            color="grey"
            style={{ marginRight: 20 }}
          />

          <View flex centerH>
            <View width={"90%"}>
              <Text grey40 marginB-10>
                Soll dein Event privat sein?
              </Text>
            </View>
            <Checkbox
              value={privatStatus}
              onValueChange={() => setPrivatStatus(!privatStatus)}
              borderRadius={10}
              color={Colors.secondaryColor}
            />
          </View>
        </Card>

        {/* Submit Button */}
        <Button
          disabled={checkAllEntries}
          label={"Event erstellen"}
          size={Button.sizes.large}
          backgroundColor={Colors.secondaryColor}
          borderRadius={10}
          onPress={(event) => {
            if (date != "" && time != "" && category != "") {
              console.log("Create Event");
              //TODO: Combine all the states of the Inputfields into an object and then send this object to Firebase to create an Event.
              const eventObject = {
                title: title,
                user: {
                  userID: user.uid,
                  userName: user.displayName,
                },
                category: category.value,
                date: date.toISOString().slice(0, 10),
                time: time.toISOString().slice(11, 19),
                googleMapsData: googleMapsData,
                description: description,
                coords: mapMarker,
                mapMarkerCoords: mapMarker,
                participants: [
                  { userID: user.uid, userName: user.displayName },
                ],
                createdOn: new Date().toISOString(),
                private: privatStatus,
                entryRequests: [{ userID: "", userName: "" }],
              };
              setHttpPosting(true);
              axios
                .post(
                  "https://eventify-43747-default-rtdb.europe-west1.firebasedatabase.app/events.json",
                  eventObject
                )
                .then(function (response) {
                  // console.log(response);
                  updateCreatedEventsByUser(user.uid, eventObject.createdOn);
                  setHttpPosting(false);
                  props.navigation.goBack();
                })
                .catch(function (error) {
                  console.log(error);
                  setHttpPosting(false);
                  console.log("Try again");
                });
            } else {
              setFinalValidationFailed(true);
            }
          }}
        />
        <Toast
          visible={finalValidationFailed}
          position={"top"}
          centerMessage={true}
          message="Bitte gib in jedem Feld Daten an."
          backgroundColor={Colors.$iconDanger}
          autoDismiss={5000}
          onDismiss={() => setFinalValidationFailed(false)}
        ></Toast>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
  withUnderline: {
    borderBottomWidth: 0,
    borderColor: Colors.$outlineDisabledHeavy,
    paddingBottom: 4,
  },
  withFrame: {
    borderWidth: 1,
    borderColor: Colors.$outlineDisabledHeavy,
    padding: 4,
    borderRadius: 2,
  },
  roundedDialog: {
    backgroundColor: Colors.$backgroundDefault,
    marginBottom: Constants.isIphoneX ? 0 : 20,
    borderRadius: 12,
  },
});
