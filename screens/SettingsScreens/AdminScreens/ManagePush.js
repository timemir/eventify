import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
// RNUILib
import {
  Button,
  Card,
  Carousel,
  Colors,
  ExpandableSection,
  Icon,
  Spacings,
  Text,
  View,
} from "react-native-ui-lib";
import Ionicons from "react-native-vector-icons/Ionicons";
export default function ManagePush(props) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View flex>
        <Ionicons
          name="arrow-back"
          size={24}
          color={Colors.secondaryColor}
          onPress={() => props.navigation.goBack()}
        />
        <Text>ManagePush</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
