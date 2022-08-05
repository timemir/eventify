import { StyleSheet, ScrollView } from "react-native";
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
} from "react-native-ui-lib";
import React, { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
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
export default function EventCreation(props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  return (
    <ScrollView>
      <View flex padding-20>
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
            placeholder="Wie soll dein Event heißen?"
            floatingPlaceholder
            floatingPlaceholderStyle={{
              color: "grey",
              opacity: 0.6,
              width: "100%",
            }}
            value={title}
            onChange={(item) => setTitle(item)}
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
              onChange={(item) => setDate(item)}
            />
          </View>
        </Card>
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
              onChange={(item) => setTime(item)}
            />
          </View>
        </Card>
        {/* Inputfield - Map */}
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
            <Text>PLACEHOLDER FOR MAP</Text>
          </View>
        </Card>
        {/* Submit Button */}
        <Button
          label={"Event erstellen"}
          size={Button.sizes.large}
          backgroundColor={Colors.secondaryColor}
          borderRadius={10}
          onPress={(event) => {
            props.navigation.goBack();
            console.log("Create Event");
            //TODO: Combine all the states of the Inputfields into an object and then send this object to Firebase to create an Event.
          }}
        />
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
});
