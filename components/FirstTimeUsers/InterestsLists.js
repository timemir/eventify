import { StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
// RNUILib
import {
  Card,
  Text,
  Spacings,
  View,
  Button,
  Icon,
  Colors,
  GridList,
  BorderRadiuses,
} from "react-native-ui-lib";
import { fetchAllCategories } from "../../store/http";
import InterestItem from "./InterestItem";

export default function InterestsLists() {
  // Get Categories from Firebase
  const [fetchedCategories, setFetchedCategories] = useState([]);
  useEffect(() => {
    async function getCategories() {
      const categories = await fetchAllCategories();
      setFetchedCategories(categories);
    }
    getCategories();
  }, []);
  // ----------------------------------------------------------------
  // Background Array that Keeps track of all liked categories
  const likedCategories = [];

  // Each individual rendered Interest to select
  function renderItem({ item }) {
    // Rendering of each Card with Category

    return <InterestItem item={item} />;
  }
  // ----------------------------------------------------------------

  return (
    <ScrollView>
      <View flex>
        <View center marginH-30>
          <View marginV-20>
            <Text h1 center text50BL>
              Wähle einige Kategorien aus, die dich interessieren!
            </Text>
          </View>
          <View marginB-30>
            <Text center grey40>
              Erstelle ein Interessenprofil, sodass wir dir persönlich relevante
              Events anzeigen können.
            </Text>
          </View>
        </View>
        <View flex>
          <GridList
            data={fetchedCategories}
            renderItem={renderItem}
            maxItemWidth={200}
            numColumns={2}
            horizontal={false}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: Spacings.s5,
  },
});
