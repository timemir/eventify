import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
// RNUILib
import {
  Card,
  Carousel,
  Colors,
  ExpandableSection,
  Icon,
  Spacings,
  Text,
  View,
} from "react-native-ui-lib";
import EventSection from "../../components/UI/HomeScreen/EventSection";
import loadFoundationConfig from "../../RNUILib/FoundationConfig";
import { GlobalStyles } from "../../util/GlobalColors";
loadFoundationConfig();

// http helper functions
import { fetchAllCategories, fetchAllEvents } from "../../store/http";
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
      {/* BUBBLES */}
      <View
        absT
        height={300}
        width={"100%"}
        style={{
          overflow: "hidden",
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          // backgroundColor: "#eee2e2",
        }}
      >
        <View
          abs
          style={{
            left: -5,
            top: -110,
            zIndex: 1,
            backgroundColor: Colors.bubbleColor,
          }}
          borderRadius={180}
          width={360}
          height={360}
        />
        <View
          abs
          style={{
            right: -90,
            top: -90,
            zIndex: 2,
            backgroundColor: Colors.bubbleColorTertiary,
          }}
          borderRadius={160}
          width={320}
          height={320}
        />
        <View
          abs
          style={{
            left: -50,
            top: 65,
            zIndex: 2,
            backgroundColor: Colors.bubbleColorSecondary,
          }}
          borderRadius={65}
          width={130}
          height={130}
        />
      </View>
      <ScrollView style={{ marginBottom: 45 }}>
        {/* RENDER EVENT CREATION MODAL: */}
        <View>
          <Card
            row
            center
            flex
            height={160}
            style={{
              marginBottom: 15,
              marginTop: 15,
              backgroundColor: Colors.secondaryColor,
            }}
            onPress={() =>
              props.navigation.navigate("eventCreation", fetchedCategories)
            }
            borderRadius={15}
            activeOpacity={1}
          >
            <Card.Section
              imageSource={require("../../assets/images/guyOnChair.png")}
              imageStyle={{ width: 115, height: "100%" }}
            />

            <View flex center>
              <Text text60BO white>
                Neues Event erstellen
              </Text>
              <Text center style={{ marginHorizontal: 20 }} grey60 text90>
                Organisiere deine eigenen Events
              </Text>
            </View>
            <Ionicons
              name={"arrow-forward-outline"}
              size={34}
              color={"white"}
            />
          </Card>
        </View>
        {/* RENDER STADTDORTMUND SECTION: */}
        <View marginB-40>
          {fetchedCategories.map((categoryName, index) => {
            if (categoryName.toLowerCase() === "stadtdortmund") {
              return (
                <EventSection
                  key={index}
                  sectionName={categoryName}
                  highlight={true}
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
            } else {
              return;
            }
          })}
        </View>
        {/* RENDER CATEGORY SECTIONS: */}
        {fetchedCategories.map((categoryName, index) => {
          if (categoryName.toLowerCase() === "stadtdortmund") {
            return;
          } else {
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
          }
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
