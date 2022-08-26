import React from "react";
import { StyleSheet } from "react-native";
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
export default function AdminDashboard(props) {
  return (
    <View flex margin-10 marginB-80>
      <Text center text30BO marginV-15>
        Admin Dashboard
      </Text>
      <Card
        flex
        center
        marginV-10
        borderRadius={20}
        backgroundColor={Colors.secondaryColor}
        onPress={() => props.navigation.navigate("manageUsers")}
      >
        <View center flex>
          <Text center white text40BO>
            Nutzer verwalten
          </Text>
        </View>
      </Card>
      <Card
        flex
        center
        marginV-10
        borderRadius={20}
        backgroundColor={Colors.secondaryColor}
        onPress={() => props.navigation.navigate("manageEvents")}
      >
        <View center flex>
          <Text center white text40BO>
            Events verwalten
          </Text>
        </View>
      </Card>
      <Card
        flex
        center
        marginV-10
        borderRadius={20}
        backgroundColor={Colors.secondaryColor}
        onPress={() => props.navigation.navigate("managePush")}
      >
        <View center flex>
          <Text center white text40BO>
            Push Notifications
          </Text>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({});
