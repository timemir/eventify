import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function BackArrow(props) {
  return (
    <Pressable onPress={props.onPress}>
      <View style={props.style}>
        <Ionicons name="arrow-back" size={32} color="black" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({});
