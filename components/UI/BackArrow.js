import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

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
