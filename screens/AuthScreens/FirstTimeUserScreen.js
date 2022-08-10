import { StyleSheet, SafeAreaView } from "react-native";
import React from "react";

// RNUILib
import {
  Card,
  Text,
  Spacings,
  View,
  Button,
  Icon,
  Colors,
} from "react-native-ui-lib";
// Async Storage
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FirstTimeUserScreen(props) {
  async function setFirstTimeUserStatus() {
    try {
      await AsyncStorage.setItem("@first_time_user", "0");
      console.log("Set AsyncStorage successfully");
      props.navigation.goBack();
    } catch (error) {
      // saving error
      console.log(error);
    }
  }
  return (
    <SafeAreaView>
      <View>
        <Text>FirstTimeUserScreen</Text>
        <Button
          label={"Set First Time User Status to null"}
          size={Button.sizes.large}
          onPress={setFirstTimeUserStatus}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
