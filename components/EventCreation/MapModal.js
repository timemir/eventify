import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Colors, Incubator, View } from "react-native-ui-lib";

// Maps
import MapView, { Marker } from "react-native-maps";
// Google Places API

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

// Incubators are experimental Components from RNUILib
const { TextField } = Incubator;

export default function MapModal(props) {
  const [buttonState, setButtonState] = useState(true);
  const [mapRegion, setMapRegion] = useState(props.route.params.mapRegion);
  const [mapMarker, setMapMarker] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [googleMapsData, setgoogleMapsData] = useState({});
  const [poi, setPoi] = useState(null);
  const ref = useRef();

  useEffect(() => {
    props.navigation.addListener("focus", () => {});
  }, []);

  return (
    <View flex margin-10>
      <View flex centerH>
        {/* Search Bar with Google Integration */}
        <GooglePlacesAutocomplete
          placeholder="Suche nach einem Ort"
          fetchDetails={true}
          GooglePlacesSearchQuery={{
            rankby: "distance",
          }}
          ref={ref}
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            // console.log(details);

            setMapRegion({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
            setMapMarker({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            });
            setgoogleMapsData({
              name: `${details.name}`,
              street: `${details.formatted_address.split(",")[0]}`,
              city: `${details.formatted_address.split(",")[1]}`,
            });
            setButtonState(false);
          }}
          query={{
            //TODO: REMOVE API KEY IN PRODUCTION!
            key: "AIzaSyAuZPnw7i5OQrwKWytiyvhV6wCCeEOgxps",
            language: "de",
            components: "country:DE",
            radius: 3000,
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
              zIndex: 199,
            },
            listView: { backgroundColor: "white", zIndex: 199 },
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
          onPoiClick={(event) => {
            const pressedPoi = event.nativeEvent;
            setPoi(pressedPoi);
            setMapMarker(event.nativeEvent.coordinate);
            ref.current?.setAddressText(pressedPoi.name);
            // console.log(pressedPoi);
            ref.current?.focus();
          }}
          onPress={(event) => {}}
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
        disabled={buttonState}
        label="Fertig"
        backgroundColor={Colors.secondaryColor}
        borderRadius={10}
        marginT-5
        onPress={() => {
          props.route.params.onReturn(googleMapsData, mapRegion);
          props.navigation.goBack();

          // TODO: Save Marker Coords
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
