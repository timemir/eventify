import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

//TODO : Connect Image Source with User Profile Picture from Firebase
export default function ProfileCircleSmall(props) {
  return (
    <View>
      <Pressable onPress={props.onPress}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/images/profileSmall.jpg")}
            style={styles.image}
          />
        </View>
      </Pressable>
    </View>
  );
}
const IMAGE_SIZE = 40;
const styles = StyleSheet.create({
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    overflow: "hidden",
    margin: 10,
    marginBottom: 15,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
});
