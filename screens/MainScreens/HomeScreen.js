import { SafeAreaView, StyleSheet, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";
// RNUILib
import {
  Card,
  Text,
  Carousel,
  Spacings,
  View,
  ExpandableSection,
  Icon,
  Colors,
} from "react-native-ui-lib";
import EventSection from "../../components/UI/HomeScreen/EventSection";
import loadFoundationConfig from "../../RNUILib/FoundationConfig";
import { GlobalStyles } from "../../util/GlobalColors";
loadFoundationConfig();
//TODO: Fetch Category Names from Firebase
const DUMMY_SECTIONS = [
  "StadtDORTMUND",
  "Schwimmen",
  "Joggen",
  "Party",
  "Schach",
];

export default function HomeScreen(props) {
  //TODO: Create vertical scroll with expandable Sections that include Cards
  // that lead to a created event. compare the following:
  // wix.github.io/react-native-ui-lib/docs/components/basic/ExpandableSection
  return (
    <SafeAreaView>
      <ScrollView>
        {/* RENDER EVENT CREATION MODAL: */}
        <View>
          <Card
            row
            center
            flex
            height={160}
            style={{ marginBottom: 15, marginTop: 15 }}
            onPress={() => props.navigation.navigate("eventCreation")}
            borderRadius={15}
            activeOpacity={1}
          >
            <Card.Section
              imageSource={require("../../assets/images/small.png")}
              imageStyle={{ width: 115, height: "100%" }}
            />
            <Card.Section
              content={[
                {
                  text: "Neues Event erstellen",
                  text70: true,
                  primaryColor: true,
                  $textDefault: true,
                },
                {
                  text: "Organisiere deine eigenen Events",
                  text80: true,
                  $textDefault: true,
                  $textDisabled: true,
                },
              ]}
              contentStyle={{
                justifyContent: "center",
              }}
              style={{
                padding: 10,
                flex: 1,
              }}
            />
            <Ionicons
              name={"arrow-forward-outline"}
              size={34}
              color={"black"}
            />
          </Card>
        </View>
        {/* RENDER CATEGORY SECTIONS: */}
        {DUMMY_SECTIONS.map((categoryName, index) => {
          return (
            <EventSection key={index} sectionName={categoryName}></EventSection>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
