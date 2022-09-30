import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
// RNUILib
import { GridList, Spacings, Text, View } from "react-native-ui-lib";
import { fetchAllCategories } from "../../store/http";
import InterestItem from "./InterestItem";

export default function InterestsLists(props) {
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
  // CHILD TO PARENT DATA LOGIC
  // Background Array that Keeps track of all liked categories
  const [likedCategories, setLikedCategories] = useState([]);
  function childToParent(categoryNameFromChild) {
    if (likedCategories.includes(categoryNameFromChild)) {
      const filteredLikedCategories = likedCategories.filter(
        (item) => item !== categoryNameFromChild
      );
      console.log("REMOVE");
      setLikedCategories([...filteredLikedCategories]);
    } else {
      console.log("ADD");
      setLikedCategories((prevState) => [...prevState, categoryNameFromChild]);
    }
  }
  // Send the likedCategories array up to the FirstTimeUserScreen (when ever likedCategories gets updated)
  useEffect(() => {
    props.onChange(likedCategories);
  }, [likedCategories]);

  // ----------------------------------------------------------------
  // Each individual rendered Interest to select
  function renderItem({ item }) {
    // Rendering of each Card with Category

    return <InterestItem item={item} onLiked={childToParent} />;
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
