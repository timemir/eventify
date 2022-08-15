import { SafeAreaView, StyleSheet, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
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

// http helper functions
import { fetchAllEvents, fetchAllCategories } from "../../store/http";
// Navigation
import { useIsFocused } from "@react-navigation/native";

export default function HomeScreen(props) {
  // State for all Events
  const [fetchedCategories, setFetchedCategories] = useState([]);
  // All Events as an Object inside an Array -> [{ }, { }, { }]
  const [fetchedEvents, setFetchedEvents] = useState([]);

  // Fetch all Categories
  useEffect(() => {
    async function getCategories() {
      const categories = await fetchAllCategories();
      setFetchedCategories(categories);
    }
    getCategories();
  }, []);

  // React Navigation Hook
  const isFocused = useIsFocused();
  // Fetch all Events
  useEffect(() => {
    // Rerun useEffect Function if we re-enter the HomeScreen
    if (isFocused) {
      // Helper Function, because we cannot set useEffect function as async. not allowed!
      async function getEvents() {
        const events = await fetchAllEvents();
        setFetchedEvents(events);
      }
      getEvents();

      // DO NOT PUT ANYTHING OUTSIDE IF STATEMENT!
    }
  }, [isFocused]);

  // Tab Bar Height Constant

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
            onPress={() =>
              props.navigation.navigate("eventCreation", fetchedCategories)
            }
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
        {fetchedCategories.map((categoryName, index) => {
          return (
            <EventSection
              key={index}
              sectionName={categoryName}
              categoryEventData={() => {
                const eventsListByCategory = [];

                fetchedEvents.forEach((item) => {
                  if (item.category === categoryName) {
                    eventsListByCategory.push(item);
                  }
                });

                return eventsListByCategory;
              }}
            ></EventSection>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
