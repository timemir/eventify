import React, { useState } from "react";
import {
  DeviceEventEmitter,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  Chip,
  Colors,
  ExpandableSection,
  Incubator,
  Spacings,
  Text,
  View,
} from "react-native-ui-lib";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function SearchScreen(props) {
  const { TextField } = Incubator;
  const [expandButtons, setExpandButtons] = useState(false);
  const [filter, setFilter] = useState({});

  function onFilter(filter) {
    setFilter(filter);
    console.log("Set Filter on SearchScreen");
  }
  DeviceEventEmitter.addListener("onFilter", (eventData) =>
    onFilter(eventData)
  );

  return (
    <SafeAreaView style={{ flex: 1, margin: 20 }}>
      <ScrollView style={{ flex: 1 }}>
        <View flex>
          {/* Header Bar */}
          <View row spread>
            <TextField
              placeholder={"Suche nach einem Event"}
              containerStyle={{
                margin: 10,
                backgroundColor: Colors.greyBackgroundColor,
                height: 50,
                flex: 1,
                borderRadius: 10,
              }}
              fieldStyle={{ flex: 1, overflow: "hidden", marginLeft: 5 }}
            />
            <View center>
              <Pressable
                onPress={() => {
                  props.navigation.navigate("searchFilter");
                }}
              >
                <Ionicons
                  name={"funnel"}
                  size={30}
                  color={Colors.secondaryColor}
                />
              </Pressable>
            </View>
          </View>
          {/* Search Buttons */}
          <View>
            <View
              row
              bg-greyBackgroundColor
              br50
              padding-20
              flex
              style={{ flexWrap: "wrap" }}
            >
              <ExpandableSection
                top={false}
                expanded={expandButtons}
                sectionHeader={
                  <View flex>
                    <View
                      row
                      style={{
                        width: "100%",
                        maxWidth: "100%",
                        flexWrap: "wrap",
                      }}
                    >
                      <Chip
                        label={"StadtDORTMUND"}
                        labelStyle={{ color: Colors.white }}
                        containerStyle={{
                          borderColor: Colors.white,
                          backgroundColor: Colors.grey50,
                          marginLeft: Spacings.s3,
                        }}
                        onPress={(props) => {
                          props.style[3].backgroundColor =
                            Colors.secondaryColor;

                          console.log(props);
                        }}
                      />
                      <Chip
                        label={"Sport"}
                        labelStyle={{ color: Colors.white }}
                        containerStyle={{
                          borderColor: Colors.white,
                          backgroundColor: Colors.grey50,
                          marginLeft: Spacings.s3,
                        }}
                        onPress={(props) => {
                          props.style[3].backgroundColor =
                            Colors.secondaryColor;

                          console.log(props);
                        }}
                      />
                      <Chip
                        label={"Essen"}
                        labelStyle={{ color: Colors.white }}
                        containerStyle={{
                          borderColor: Colors.white,
                          backgroundColor: Colors.grey50,
                          marginLeft: Spacings.s3,
                        }}
                        onPress={(props) => {
                          props.style[3].backgroundColor =
                            Colors.secondaryColor;

                          console.log(props);
                        }}
                      />
                      <Chip
                        label={"Kreativ"}
                        labelStyle={{ color: Colors.white }}
                        containerStyle={{
                          borderColor: Colors.white,
                          backgroundColor: Colors.grey50,
                          marginLeft: Spacings.s3,
                        }}
                        onPress={(props) => {
                          props.style[3].backgroundColor =
                            Colors.secondaryColor;

                          console.log(props);
                        }}
                      />
                      <Chip
                        label={"Konzert"}
                        labelStyle={{ color: Colors.white }}
                        containerStyle={{
                          borderColor: Colors.white,
                          backgroundColor: Colors.grey50,
                          marginLeft: Spacings.s3,
                        }}
                        onPress={(props) => {
                          props.style[3].backgroundColor =
                            Colors.secondaryColor;

                          console.log(props);
                        }}
                      />
                      <Chip
                        label={"After-Work"}
                        labelStyle={{ color: Colors.white }}
                        containerStyle={{
                          borderColor: Colors.white,
                          backgroundColor: Colors.grey50,
                          marginLeft: Spacings.s3,
                        }}
                        onPress={(props) => {
                          props.style[3].backgroundColor =
                            Colors.secondaryColor;

                          console.log(props);
                        }}
                      />
                    </View>
                    {!expandButtons && (
                      <Text
                        center
                        style={{ marginTop: 10 }}
                        color={Colors.secondaryColor}
                      >
                        mehr anzeigen
                      </Text>
                    )}
                  </View>
                }
                onPress={() => setExpandButtons(!expandButtons)}
              >
                <View>
                  <View
                    row
                    style={{
                      width: "100%",
                      maxWidth: "100%",
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      label={"Party"}
                      labelStyle={{ color: Colors.white }}
                      containerStyle={{
                        borderColor: Colors.white,
                        backgroundColor: Colors.grey50,
                        marginLeft: Spacings.s3,
                      }}
                      onPress={(props) => {
                        props.style[3].backgroundColor = Colors.secondaryColor;

                        console.log(props);
                      }}
                    />
                    <Chip
                      label={"Fitness"}
                      labelStyle={{ color: Colors.white }}
                      containerStyle={{
                        borderColor: Colors.white,
                        backgroundColor: Colors.grey50,
                        marginLeft: Spacings.s3,
                      }}
                      onPress={(props) => {
                        props.style[3].backgroundColor = Colors.secondaryColor;

                        console.log(props);
                      }}
                    />
                    <Chip
                      label={"Wandern"}
                      labelStyle={{ color: Colors.white }}
                      containerStyle={{
                        borderColor: Colors.white,
                        backgroundColor: Colors.grey50,
                        marginLeft: Spacings.s3,
                      }}
                      onPress={(props) => {
                        props.style[3].backgroundColor = Colors.secondaryColor;

                        console.log(props);
                      }}
                    />
                    <Chip
                      label={"Joggen"}
                      labelStyle={{ color: Colors.white }}
                      containerStyle={{
                        borderColor: Colors.white,
                        backgroundColor: Colors.grey50,
                        marginLeft: Spacings.s3,
                      }}
                      onPress={(props) => {
                        props.style[3].backgroundColor = Colors.secondaryColor;

                        console.log(props);
                      }}
                    />
                    <Chip
                      label={"Tennis"}
                      labelStyle={{ color: Colors.white }}
                      containerStyle={{
                        borderColor: Colors.white,
                        backgroundColor: Colors.grey50,
                        marginLeft: Spacings.s3,
                      }}
                      onPress={(props) => {
                        props.style[3].backgroundColor = Colors.secondaryColor;

                        console.log(props);
                      }}
                    />
                    <Chip
                      label={"Tanzen"}
                      labelStyle={{ color: Colors.white }}
                      containerStyle={{
                        borderColor: Colors.white,
                        backgroundColor: Colors.grey50,
                        marginLeft: Spacings.s3,
                      }}
                      onPress={(props) => {
                        props.style[3].backgroundColor = Colors.secondaryColor;

                        console.log(props);
                      }}
                    />
                    <Chip
                      label={"Soziales"}
                      labelStyle={{ color: Colors.white }}
                      containerStyle={{
                        borderColor: Colors.white,
                        backgroundColor: Colors.grey50,
                        marginLeft: Spacings.s3,
                      }}
                      onPress={(props) => {
                        props.style[3].backgroundColor = Colors.secondaryColor;

                        console.log(props);
                      }}
                    />
                    <Chip
                      label={"Outdoor"}
                      labelStyle={{ color: Colors.white }}
                      containerStyle={{
                        borderColor: Colors.white,
                        backgroundColor: Colors.grey50,
                        marginLeft: Spacings.s3,
                      }}
                      onPress={(props) => {
                        props.style[3].backgroundColor = Colors.secondaryColor;

                        console.log(props);
                      }}
                    />
                  </View>
                  {expandButtons && (
                    <Pressable
                      onPress={() => {
                        setExpandButtons(!expandButtons);
                      }}
                      style={{ marginTop: 10 }}
                    >
                      <Text center color={Colors.secondaryColor}>
                        weniger anzeigen
                      </Text>
                    </Pressable>
                  )}
                </View>
              </ExpandableSection>
            </View>
          </View>
        </View>
        <View flex-5 bg-green30></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
