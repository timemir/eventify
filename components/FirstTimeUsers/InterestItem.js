import { StyleSheet } from "react-native";
import React, { useState } from "react";
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
import Ionicons from "react-native-vector-icons/Ionicons";

export default function InterestItem(props) {
  // Each Item gets a State that tracks if the Category got liked
  const [categoryLiked, setCategoryLiked] = useState(false);
  // Function that gets executed when pressing a card
  function onPressHandler() {
    console.log(categoryLiked ? "Disliked" : "Liked");
    setCategoryLiked(!categoryLiked);
    // console.log(categoryLiked);
    // Send the category name back to the parent and there put it into an array of all liked categories.
    props.onLiked(props.item);
  }

  //
  const itemImage = require("../../assets/images/small.png");
  return (
    <Card flex onPress={onPressHandler}>
      <Card.Section imageSource={itemImage} imageStyle={styles.itemImage} />
      <View center padding-s2>
        <Text $textDefault>
          <Text color={Colors.secondaryColor}>#</Text>
          {`${props.item}`}
        </Text>

        {/* {item.inventory.status === 'Out of Stock' && (
            <Text text90M $textDangerLight>
              {item.inventory.status}
            </Text>
          )} */}
      </View>
      <View absR margin-8>
        <Ionicons
          name={categoryLiked ? "heart" : "heart-outline"}
          size={34}
          color={categoryLiked ? "red" : "grey"}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  itemImage: {
    width: "100%",
    height: 85,
    borderRadius: BorderRadiuses.br10,
  },
});
