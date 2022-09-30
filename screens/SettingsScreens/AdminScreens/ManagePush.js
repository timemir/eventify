import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
// RNUILib
import { Card, Colors, Text, View } from "react-native-ui-lib";
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
        <View flex margin-10 marginV-20>
          <Card
            flex
            center
            marginV-10
            borderRadius={20}
            backgroundColor={Colors.secondaryColor}
            onPress={() => props.navigation.navigate("managePushAll")}
          >
            <View center flex>
              <Text center white text40BO>
                Notification an alle Nutzer senden
              </Text>
            </View>
          </Card>
          <Card
            flex
            center
            marginV-10
            borderRadius={20}
            backgroundColor={Colors.secondaryColor}
            onPress={() => props.navigation.navigate("managePushIndi")}
          >
            <View center flex>
              <Text center white text40BO>
                Notification an einen bestimmten Nutzer senden
              </Text>
            </View>
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
