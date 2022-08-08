import { StyleSheet, ScrollView, Pressable } from "react-native";
import {
  Card,
  Text,
  Spacings,
  View,
  Colors,
  Picker,
  Incubator,
  DateTimePicker,
  Button,
  Dialog,
  Constants,
  LoaderScreen,
  Toast,
} from "react-native-ui-lib";
import React, { useState, useContext } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
// Maps
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// Firebase Auth
import { auth } from "../../store/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// Axios - HTTP Request
import axios from "axios";
// Global Auth Context
import { AuthContext } from "../../store/auth-context";
// Incubators are experimental Components from RNUILib
const { TextField } = Incubator;

// DUMMY DATA
const DUMMY_SECTIONS = [
  "StadtDORTMUND",
  "Schwimmen",
  "Joggen",
  "Party",
  "Schach",
];
// Main Function Component
export default function EventCreation(props) {
  // Creation of states (Data that gets send to the event object for event creation)
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [googleMapsData, setgoogleMapsData] = useState("");
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
  const [dialogState, setDialogState] = useState(false);
  // HTTP POST State
  const [httpPosting, setHttpPosting] = useState(false);
  // Final Validation State
  const [finalValidationFailed, setFinalValidationFailed] = useState(false);
  // ----------------------------------------------------------------
  // Checking if user is signed in to get userID
  const auth = getAuth();
  const user = auth.currentUser;

  // Rendering of the component
  return (
    <ScrollView>
      <View flex padding-20>
        {/* Render LoaderScreen when we are Creating a new event*/}
        {httpPosting && (
          <View flex padding-200>
            <LoaderScreen message={"Creating Event..."} color={Colors.grey40} />
          </View>
        )}

        <Text text40 grey20 marginB-30 center>
          Event Erstellung
        </Text>
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
            autoFocus
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
            {DUMMY_SECTIONS.map((option, index) => (
              <Picker.Item key={index} value={option} label={option} />
            ))}
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
        {/* Inputfield - Map */}
        <Dialog
          useSafeArea
          key={1}
          bottom={true}
          height={"95%"}
          // panDirection={Dialog.directions.DOWN}
          containerStyle={styles.roundedDialog}
          visible={dialogState}
          onDismiss={() => setDialogState(false)}
          // renderPannableHeader={(props) => {
          //   const { title } = props;
          //   return (
          //     <View>
          //       <View margin-15 center>
          //         <Text $textDefault>{title}</Text>
          //       </View>
          //       <View height={2} bg-grey70 />
          //     </View>
          //   );
          // }}
          pannableHeaderProps={{
            title: "Drücke auf die Karte um einen Pin zu erstellen.",
          }}
          supportedOrientations={["portrait", "landscape"]}
          ignoreBackgroundPress={true}
        >
          {/* Content inside the Dialog - BIG MAP */}
          <View flex margin-10>
            <View flex centerH>
              {/* Search Bar with Google Integration */}
              <GooglePlacesAutocomplete
                placeholder="Suche nach einem Ort"
                fetchDetails={true}
                GooglePlacesSearchQuery={{
                  rankby: "distance",
                }}
                onPress={(data, details = null) => {
                  // 'details' is provided when fetchDetails = true
                  console.log(data, details);
                  setgoogleMapsData({ data: data, details: details });
                  setMapRegion({
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  });
                }}
                query={{
                  //TODO: REMOVE API KEY IN PRODUCTION!
                  key: "AIzaSyAuZPnw7i5OQrwKWytiyvhV6wCCeEOgxps",
                  language: "de",
                  components: "country:DE",
                  radius: 30000,
                  location: `${mapRegion.latitude}, ${mapRegion.longitude}`,
                }}
                onFail={(error) => {
                  console.log(error);
                }}
                styles={{
                  container: {
                    flex: 0,
                    position: "absolute",
                    width: "100%",
                    zIndex: 1,
                  },
                  listView: { backgroundColor: "white" },
                }}
              />
              <MapView
                style={{ alignSelf: "stretch", height: "100%" }}
                region={mapRegion}
                provider="google"
                onRegionChangeComplete={(region) => {
                  setMapRegion((prevState) => {
                    return { prevState, ...region };
                  });
                }}
                onPress={(event) => {
                  console.log(`${mapRegion.latitude}, ${mapRegion.longitude}`);
                  setMapMarker(event.nativeEvent.coordinate);
                }}
              >
                <Marker
                  coordinate={{
                    latitude: mapMarker.latitude,
                    longitude: mapMarker.longitude,
                  }}
                  draggable={true}
                  onDragEnd={(event) => {
                    console.log(event.nativeEvent.coordinate);
                  }}
                ></Marker>
              </MapView>
            </View>
            <Button
              text60
              label="Fertig"
              backgroundColor={Colors.secondaryColor}
              borderRadius={10}
              marginT-5
              onPress={() => {
                setDialogState(false);
                // TODO: Save Marker Coords
              }}
            />
          </View>
        </Dialog>
        {/* Inputfield - Small Map */}
        <Pressable
          onPress={() => {
            // props.navigation.navigate("eventCreationMap"); // Alternative way of making the big map
            setDialogState(true);
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
                style={{ alignSelf: "stretch", height: "100%" }}
                region={mapRegion}
                provider="google"
              />
            </View>
          </Card>
        </Pressable>
        {/* Submit Button */}
        <Button
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
                coords: {
                  longitude: mapRegion.longitude,
                  latitude: mapRegion.latitude,
                },
                mapMarkerCoords: mapMarker,
                participants: [
                  { userID: user.uid, userName: user.displayName },
                ],
              };
              setHttpPosting(true);
              axios
                .post(
                  "https://eventify-43747-default-rtdb.europe-west1.firebasedatabase.app/events.json",
                  eventObject
                )
                .then(function (response) {
                  console.log(response);
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
    </ScrollView>
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
