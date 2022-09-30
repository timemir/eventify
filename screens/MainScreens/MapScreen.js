import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { categoryImage } from "../../util/categoriesImages";
//RNUILIB
import {
  Button,
  Card,
  Colors,
  Constants,
  Dialog,
  Text,
  Toast,
  View,
} from "react-native-ui-lib";
// MAP
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
// HTTP Requests
import axios from "axios";
// Navigation
import { useIsFocused } from "@react-navigation/native";
// Icons
import Ionicons from "react-native-vector-icons/Ionicons";

// Main Function Component
export default function MapScreen(props) {
  // Initial Map Coordinates
  const [mapView, setMapView] = useState({
    latitude: 51.512408,
    longitude: 7.466741,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  // Navigation Stuff
  const isFocused = useIsFocused();
  // Fetch State
  const [fetchingFailed, setFetchingFailed] = useState(false);
  // Show Event Modal State
  const [showEventModal, setShowEventModal] = useState({
    show: false,
    markerData: {},
  });
  // List of Event Markers
  const [eventMarkersList, setEventMarkersList] = useState([]);

  // Fetch Event Coordinates from Firebase once Component mounts
  useEffect(() => {
    if (isFocused) {
      axios
        .get(
          "https://eventify-43747-default-rtdb.europe-west1.firebasedatabase.app/events.json"
        )
        .then(function (response) {
          // handle success

          // EVENT MARKER
          const eventMarkers = [];

          // "key" is the auto generated key from Firebase
          for (const key in response.data) {
            const markerObject = {
              eventId: key,
              createdBy: response.data[key].user,
              coords: response.data[key].mapMarkerCoords,
              title: response.data[key].title,
              dateToLocal: new Date(
                response.data[key].date
              ).toLocaleDateString(),
              date: response.data[key].date,
              userName: `${response.data[key].user.userName}`,
              private: response.data[key].private,
              entryRequests: response.data[key].entryRequests,
              category: response.data[key].category,
              participants: response.data[key].participants,
              location: response.data[key].googleMapsData,
              description: response.data[key].description,
              time: response.data[key].time,
            };
            eventMarkers.push(markerObject);
          }
          setEventMarkersList(eventMarkers);

          // ----------------------------------------------------------------
          // EVENT DATA

          // ----------------------------------------------------------------
          console.log("Called useEffect - Fetched Data");
          setFetchingFailed(false);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          setFetchingFailed(true); // Displays a Toast with an Error Message
        })
        .then(function () {
          // always executed
        });
    }
  }, [isFocused]);

  return (
    <View flex centerH>
      <MapView
        style={{ alignSelf: "stretch", height: "100%" }}
        provider={PROVIDER_GOOGLE}
        initialRegion={mapView}
        onRegionChangeComplete={(region) => {
          setMapView(region);
        }}
      >
        {/* Render all Markers from Firebase */}
        {eventMarkersList.map((marker) => (
          <Marker
            pinColor={Colors.secondaryColor}
            key={marker.eventId}
            coordinate={marker.coords}
            title={marker.title}
            description={marker.dateToLocal}
          >
            <Callout
              tooltip
              onPress={() => {
                // TODO: Pass on Event ID from Marker to the setShow

                setShowEventModal({ show: true, markerData: marker });
                // console.log(showEventModal.markerData);
                // console.log(showEventModal.markerData);
              }}
              style={styles.customView}
            >
              <View style={styles.container}>
                <View style={styles.bubble}>
                  <View spread style={styles.amount}>
                    <Text text60 marginB-10>{`${marker.title} `}</Text>
                    <Text marginB-3>{`Datum: ${marker.dateToLocal} `}</Text>
                    <Text marginB-5>{`erstellt von: ${marker.userName} `}</Text>
                  </View>
                  <View flex alignSelf="stretch">
                    <Button
                      label={"Event anzeigen"}
                      size={Button.sizes.xSmall}
                      backgroundColor={Colors.secondaryColor}
                      flex
                    ></Button>
                  </View>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      {showEventModal.show && (
        <Dialog
          useSafeArea
          key={1}
          bottom={true}
          height={"95%"}
          containerStyle={styles.roundedDialog}
          visible={showEventModal.show}
          onDismiss={() =>
            setShowEventModal({ ...showEventModal, show: false })
          }
          ignoreBackgroundPress={false}
        >
          <View flex>
            <Card
              row
              center
              height={200}
              style={{ marginBottom: 5, marginTop: 10, marginHorizontal: 10 }}
              borderRadius={15}
              activeOpacity={1}
            >
              <Card.Image
                source={
                  categoryImage[
                    showEventModal.markerData.category.toLowerCase()
                  ]
                }
                height={"100%"}
                width={"100%"}
              />
            </Card>

            <View marginB-10 marginH-10>
              <Text>
                <Text secondaryColor>#</Text>
                {`${showEventModal.markerData.category}`}
              </Text>
            </View>
            <Text
              text40BO
              marginH-10
            >{`${showEventModal.markerData.title}`}</Text>
            {/* Event Details */}
            <ScrollView>
              <View>
                {/* Datum */}
                <Card row margin-15 enableShadow={false}>
                  <Ionicons
                    name="calendar"
                    size={24}
                    color="grey"
                    style={{ marginRight: 20 }}
                  />
                  <Text
                    grey30
                    text60BO
                  >{`${showEventModal.markerData.dateToLocal}`}</Text>
                </Card>
                {/* Adresse */}
                <Card row margin-15 centerV enableShadow={false}>
                  <Ionicons
                    name="navigate-circle"
                    size={24}
                    color="grey"
                    style={{ marginRight: 20 }}
                  />

                  <View style={{ width: "70%" }}>
                    <Text
                      text60BO
                      grey30
                      textAlign
                    >{`${showEventModal.markerData.location.name} `}</Text>
                    <Text
                      text60BO
                      grey30
                    >{`${showEventModal.markerData.location.street}`}</Text>
                    <Text
                      text60BO
                      grey30
                    >{`${showEventModal.markerData.location.city}`}</Text>
                  </View>
                </Card>
                {/* Teilnehmer */}
                <Card row centerV margin-15 enableShadow={false}>
                  <Ionicons
                    name="person-circle"
                    size={24}
                    color="grey"
                    style={{ marginRight: 20 }}
                  />
                  <View>
                    <View row left>
                      <Text grey30 text60BO marginR-5>{`Teilnehmer`}</Text>
                    </View>

                    <Text grey30>
                      {showEventModal.markerData.participants.length === 1
                        ? `Es nimmt eine Person an dem Event teil.`
                        : `Es nehmen ${showEventModal.markerData.participants.length} Leute an dem Event teil.`}
                    </Text>
                  </View>
                </Card>
                {/* Beschreibung */}
                <Card row margin-15 enableShadow={false}>
                  <Ionicons
                    name="newspaper-outline"
                    size={24}
                    color="grey"
                    style={{ marginRight: 20 }}
                  />
                  <View width={"80%"}>
                    <Text grey30 marginB-10 text60BO>{`Beschreibung`}</Text>
                    <Text grey30>
                      {showEventModal.markerData.description
                        ? `${showEventModal.markerData.description}`
                        : "Keine Beschreibung"}
                    </Text>
                  </View>
                </Card>
              </View>
            </ScrollView>
            <View margin-5>
              <Button
                label={"Event vollständig anzeigen"}
                style={{ backgroundColor: Colors.secondaryColor }}
                size={Button.sizes.large}
                borderRadius={10}
                onPress={() => {
                  console.log("Event vollständig anzeigen");
                  const eventObject = showEventModal.markerData;
                  console.log(eventObject.date);
                  setShowEventModal({ ...showEventModal, show: false });
                  props.navigation.navigate("mainEventScreen", eventObject);
                }}
              />
            </View>
          </View>
        </Dialog>
      )}
      <Toast
        visible={fetchingFailed}
        position={"top"}
        centerMessage={true}
        message="(Fehler) Events konnten nicht geladen werden."
        backgroundColor={Colors.$iconDanger}
        autoDismiss={5000}
        onDismiss={() => setFetchingFailed(false)}
      ></Toast>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignSelf: "flex-start",
  },

  amount: {
    flex: 1,
  },
  customView: {
    width: 180,
    height: "auto",
  },
  bubble: {
    flex: 1,
    backgroundColor: "#f0f0f0ff",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  calloutButton: {
    width: "auto",
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 10,
  },
  roundedDialog: {
    backgroundColor: Colors.$backgroundDefault,
    marginBottom: Constants.isIphoneX ? 0 : 20,
    borderRadius: 12,
  },
});
