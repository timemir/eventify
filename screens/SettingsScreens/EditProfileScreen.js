import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import {
  BorderRadiuses,
  Button,
  Card,
  Carousel,
  Colors,
  Constants,
  DateTimePicker,
  Dialog,
  GridList,
  Image,
  Incubator,
  KeyboardTrackingView,
  LoaderScreen,
  Picker,
  Spacings,
  Text,
  Toast,
  View,
} from "react-native-ui-lib";

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
