import { StyleSheet } from "react-native";
import React, { useState } from "react";
import {
  Card,
  Text,
  Carousel,
  Spacings,
  View,
  ExpandableSection,
} from "react-native-ui-lib";
// --------------------------------------------------------------
import loadFoundationConfig from "../../../RNUILib/FoundationConfig";
loadFoundationConfig();
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
// Renders the content inside the section (each card)
function SectionBody() {
  return (
    <Carousel pageWidth={350} itemSpacings={Spacings.s2}>
      {DUMMY_ELEMENTS.map((element, key) => {
        return (
          <View key={key} margin-12>
            {element}
          </View>
        );
      })}
    </Carousel>
  );
}

export default function EventSection(props) {
  const [expanded, setExpanded] = useState(true);

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
