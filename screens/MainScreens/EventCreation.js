import { StyleSheet } from "react-native";
import {
  Card,
  Text,
  Spacings,
  View,
  Colors,
  Picker,
  Incubator,
  DateTimePicker,
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
export default function EventCreation() {
  const [category, setCategory] = useState("");
  return (
    <View flex padding-20>
      <Text text40 grey20 marginB-30>
        Event Erstellung
      </Text>
      {/* Inputfield - Event title */}
      <Card
        row
        padding-10
        height={80}
        center
        marginB-20
        style={{ backgroundColor: "#FAA353" }}
      >
        <TextField
          placeholder="Wie soll dein Event heißen?"
          containerStyle={{ flexGrow: 1 }}
          fieldStyle={styles.withUnderline}
          color="white"
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
        style={{ backgroundColor: "#FAA353" }}
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
            color: "white",
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
        padding-10
        height={160}
        center
        marginB-20
        style={{ backgroundColor: "#FAA353" }}
      >
        <Ionicons
          name="calendar-outline"
          size={24}
          color="grey"
          style={{ marginRight: 20 }}
        />
        <DateTimePicker
          placeholder={"An welchem Datum findet dein Event statt?"}
          mode={"date"}
          color="white"
          containerStyle={{ padding: 10 }}
        />
        <Ionicons
          name="stopwatch-outline"
          size={24}
          color="grey"
          style={{ marginRight: 20 }}
        />
      </Card>
      {/* Inputfield - Event time */}
      <Card
        padding-10
        height={160}
        center
        marginB-20
        style={{ backgroundColor: "#FAA353" }}
      >
        <Ionicons
          name="calendar-outline"
          size={24}
          color="grey"
          style={{ marginRight: 20 }}
        />
        <DateTimePicker
          placeholder={"Um wieviel Uhr findet dein Event statt?"}
          mode={"time"}
          color="white"
          containerStyle={{ padding: 10 }}
        />
        <Ionicons
          name="stopwatch-outline"
          size={24}
          color="grey"
          style={{ marginRight: 20 }}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({});
