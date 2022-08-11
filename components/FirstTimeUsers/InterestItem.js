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

export default function InterestItem({ item }) {
  // Each Item gets a State that tracks if the Category got liked
  const [categoryLiked, setCategoryLiked] = useState(false);
  // Function that gets executed when pressing a card
  function onPressHandler() {
    console.log(categoryLiked ? "Liked" : "Disliked");
    setCategoryLiked(!categoryLiked);
    console.log(categoryLiked);
  }

  //
  const itemImage = require("../../assets/images/small.png");
  return (
    <Card flex onPress={onPressHandler}>
      <Card.Section imageSource={itemImage} imageStyle={styles.itemImage} />
      <View padding-s2>
        <Text $textDefault>
          <Text color={Colors.secondaryColor}>#</Text>
          {`${item}`}
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
