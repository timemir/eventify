import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Button, View } from "react-native-ui-lib";

export default function EditProfileScreen(props) {
  return (
    <SafeAreaView>
      <View>
        <Button label="Go Back" onPress={() => props.navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
