import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";

export default function ButtonDefault(props) {
  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => pressed && styles.pressedButton}
    >
      <View style={styles.button}>
        <Text style={styles.text}>{props.title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    backgroundColor: "#FAA353",
    borderColor: "#FAA353",
    borderRadius: 15,
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
    padding: 18,
  },
  pressedButton: {
    opacity: 0.7,
  },
});
