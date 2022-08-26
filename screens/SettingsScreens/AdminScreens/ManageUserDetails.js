import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
// RNUILib
import {
  Avatar,
  Button,
  Card,
  Carousel,
  Colors,
  ExpandableSection,
  Icon,
  Spacings,
  Switch,
  Text,
  View,
} from "react-native-ui-lib";
import Ionicons from "react-native-vector-icons/Ionicons";
import { changeAdminStatus } from "../../../util/adminFunctions";

export default function ManageUserDetails(props) {
  const [userData, setUserData] = useState(null);
  const [adminSwitch, setAdminSwitch] = useState(
    props.route.params.user.isAdmin
  );
  useEffect(() => {
    setUserData(props.route.params.user);
  }, [props.route.params.user]);

  function contactHandler() {
    console.log("contactHandler");
    //TODO: Open up Email App with user email
  }
  function banHandler() {
    console.log("banHandler");
    //TODO: Ban user from app somehow?
  }
  function deleteHandler() {
    console.log("deleteHandler");
    //TODO: Delete user entry from Firebase
  }

  // Disable the admin switch for this specific email, so that we always have at least one admin
  function disabledHandler() {
    if (userData?.email === "admin@admin.com") {
      return true;
    } else {
      return false;
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, margin: 10 }}>
      <Ionicons
        name="arrow-back"
        size={24}
        color={Colors.secondaryColor}
        onPress={() => props.navigation.goBack()}
      />
      <ScrollView style={{ flex: 1 }}>
        <Text text40BO marginV-15>
          Nutzer Daten
        </Text>
        <Text>{`Name: ${userData?.firstName} ${userData?.lastName}`}</Text>
        <Text>{`UID   : ${userData?.uid} `}</Text>
        <Text>{`Email: ${userData?.email} `}</Text>
        <Text>{`Stadt: ${userData?.city?.value} `}</Text>
        <Text text40BO marginV-15>
          Nutzer verwalten
        </Text>
        <View flex>
          <View row spread marginR-15 marginB-30>
            <Text>Admin Status</Text>
            <Switch
              value={adminSwitch}
              disabled={disabledHandler()}
              onValueChange={() => {
                setAdminSwitch(!adminSwitch);
                try {
                  changeAdminStatus(props.route.params.userKey, !adminSwitch);
                } catch (error) {
                  console.log(error);
                }
              }}
              onColor={Colors.secondaryColor}
            />
          </View>
          <Button
            marginV-5
            borderRadius={10}
            label="Nutzer kontaktieren"
            backgroundColor={Colors.secondaryColor}
            onPress={contactHandler}
          />
          <Button
            marginT-50
            marginB-5
            borderRadius={10}
            label="Nutzer bannen"
            backgroundColor={Colors.$iconDanger}
            onPress={banHandler}
          />
          <Button
            marginV-5
            borderRadius={10}
            label="Nutzer löschen"
            backgroundColor={Colors.$iconDanger}
            onPress={deleteHandler}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
