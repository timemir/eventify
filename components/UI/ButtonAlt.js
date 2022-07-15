import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";

export default function ButtonAlt(props) {
  return (
    <View style={styles.button}>
      <Pressable
        onPress={props.onPress}
        style={({ pressed }) => pressed && styles.pressedButton}
      >
        <Text style={styles.text}>{props.title}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
    borderColor: "#7C7C7C",
    borderRadius: 15,
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    color: "#7C7C7C",
    padding: 18,
  },
  pressedButton: {
    opacity: 0.7,
  },
});
