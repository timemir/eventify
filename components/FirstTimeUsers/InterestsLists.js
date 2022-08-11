import { StyleSheet } from "react-native";
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
    <View flex>
      <GridList
        data={fetchedCategories}
        renderItem={renderItem}
        maxItemWidth={200}
        numColumns={2}
        horizontal={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: Spacings.s5,
  },
});
