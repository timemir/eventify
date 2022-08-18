import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import {
  Card,
  Carousel,
  Colors,
  ExpandableSection,
  Shadows,
  Spacings,
  Text,
  View,
} from "react-native-ui-lib";
import loadFoundationConfig from "../../../RNUILib/FoundationConfig";
import { categoryImage } from "../../../util/categoriesImages";
loadFoundationConfig();
// --------------------------------------------------------------
// DUMMY DATA
// TODO: Replace Dummy Data List with Event Data from corresponding category.
const cardImage = require("../../../assets/images/small.png");

const DUMMY_ELEMENTS = [
  <Card
    key={0}
    style={{ marginBottom: 10 }}
    onPress={() => console.log("Open Event Modal")}
  >
    <Card.Section
      content={[
        { text: "Event #1", text70: true, grey10: true },
        { text: "Event description", text90: true, grey50: true },
      ]}
      style={{ padding: 20 }}
    />
    <Card.Section imageSource={cardImage} imageStyle={{ height: 120 }} />
  </Card>,
  <Card
    key={1}
    style={{ marginBottom: 10 }}
    onPress={() => console.log("Open Event Modal")}
  >
    <Card.Section
      content={[
        { text: "Event #2", text70: true, grey10: true },
        { text: "Event description", text90: true, grey50: true },
      ]}
      style={{ padding: 20 }}
    />
    <Card.Section imageSource={cardImage} imageStyle={{ height: 120 }} />
  </Card>,
  <Card
    key={2}
    style={{ marginBottom: 10 }}
    onPress={() => console.log("Open Event Modal")}
  >
    <Card.Section
      content={[
        { text: "Event #3", text70: true, grey10: true },
        { text: "Event description", text90: true, grey50: true },
      ]}
      style={{ padding: 20 }}
    />
    <Card.Section imageSource={cardImage} imageStyle={{ height: 120 }} />
  </Card>,
];
// --------------------------------------------------------------

export default function EventSection(props) {
  const [expanded, setExpanded] = useState(true);
  const navigation = useNavigation();
  // Array with All event objects, that have the same category
  const eventsDataForCategory = props.categoryEventData();
  const cardImage = require("../../../assets/images/small.png");

  const eventCards = eventsDataForCategory.map((eventObject) => {
    return (
      <Card
        key={eventObject.eventId}
        style={[
          { marginBottom: 10, maxHeight: 250 },
          props.highlight && {
            borderWidth: 4,
            borderColor: Colors.$outlineWarning,
            shadowColor: Colors.grey40,
            shadowOpacity: 0.18,
            shadowRadius: 5,
            shadowOffset: { height: -1, width: 0 },
            elevation: 2,
          },
        ]}
        onPress={() => {
          navigation.navigate("mainEventScreen", eventObject);
        }}
      >
        <Card.Section
          content={[
            { text: `${eventObject.title}`, text70: true, grey10: true },
            {
              text: `${new Date(eventObject.date).toLocaleDateString()}`,
              text90: true,
              grey50: true,
            },
          ]}
          style={{ padding: 20 }}
        />
        <Card.Section
          imageSource={categoryImage[eventObject.category.toLowerCase()]}
          imageStyle={{ height: 120 }}
        />
      </Card>
    );
  });

  // Renders the content inside the section (each card)
  function SectionBody() {
    return (
      <Carousel pageWidth={350} itemSpacings={Spacings.s2}>
        {eventCards.map((element, key) => {
          return (
            <View key={key} margin-12>
              {element}
            </View>
          );
        })}
      </Carousel>
    );
  }

  // Main Rendering
  return (
    <View>
      <ExpandableSection
        top={false}
        expanded={expanded}
        sectionHeader={
          <View margin-10 spread row>
            <Text secondaryColor text50>
              {`#${props.sectionName}`}
            </Text>
          </View>
        }
        onPress={() => {
          return setExpanded(!expanded);
        }}
      >
        <SectionBody></SectionBody>
      </ExpandableSection>
    </View>
  );
}

const styles = StyleSheet.create({});
