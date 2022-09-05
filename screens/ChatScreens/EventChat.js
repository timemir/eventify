import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Avatar,
  Button,
  Card,
  Colors,
  Constants,
  Dialog,
  Incubator,
  KeyboardTrackingView,
  LoaderScreen,
  Spacings,
  Text,
  Toast,
  View,
} from "react-native-ui-lib";
import Ionicons from "react-native-vector-icons/Ionicons";
const { TextField } = Incubator;
export default function EventChat(props) {
  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 20 }}>
      <View flex>
        <Ionicons
          name="arrow-back"
          size={24}
          color={Colors.secondaryColor}
          onPress={() => props.navigation.goBack()}
        />
        <View></View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
