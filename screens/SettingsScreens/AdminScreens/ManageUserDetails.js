import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
// RNUILib
import {
  Button,
  Colors,
  Constants,
  Dialog,
  Switch,
  Text,
  View,
} from "react-native-ui-lib";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  banUser,
  changeAdminStatus,
  checkBanStatus,
  deleteUser,
  unbanUser,
} from "../../../util/adminFunctions";

export default function ManageUserDetails(props) {
  const [userData, setUserData] = useState(null);
  const [adminSwitch, setAdminSwitch] = useState(
    props.route.params.user.isAdmin
  );
  const [dialogTitle, setDialogTitle] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [userIsBanned, setUserIsBanned] = useState(false);
  //
  //
  useEffect(() => {
    setUserData(props.route.params.user);
    setUserIsBanned(checkBanStatus(userData?.uid));
  }, [props.route.params.user, userData]);

  function contactHandler() {
    console.log("contactHandler");
    //TODO: Open up Email App with user email
  }
  function banHandler() {
    setDialogTitle("Wollen Sie den Nutzer wirklich bannen?");
    setShowConfirm(true);
  }
  function deleteHandler() {
    setDialogTitle("Wollen Sie die Nutzerdaten wirklich löschen?");
    setShowConfirm(true);
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
          <View row spread marginR-15 marginB-15>
            <Text>Nutzer Status</Text>
            {userIsBanned ? (
              <Text color={Colors.$textDangerLight}>gebannt</Text>
            ) : (
              <Text color={Colors.$textSuccessLight}>aktiv</Text>
            )}
          </View>
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
          {userIsBanned ? (
            <Button
              marginT-50
              marginB-5
              borderRadius={10}
              label="Nutzer unbannen"
              backgroundColor={Colors.$iconSuccessLight}
              onPress={() => {
                unbanUser(userData?.uid);
                setUserIsBanned(false);
              }}
            />
          ) : (
            <Button
              marginT-50
              marginB-5
              borderRadius={10}
              label="Nutzer bannen"
              backgroundColor={Colors.$iconDanger}
              onPress={banHandler}
            />
          )}
          <Button
            marginV-5
            borderRadius={10}
            label="Nutzer löschen"
            backgroundColor={Colors.$iconDanger}
            onPress={deleteHandler}
          />
          <Dialog
            useSafeArea
            key={"deleteDialog"}
            bottom
            height={120}
            panDirection={["down"]}
            containerStyle={styles.roundedDialog}
            visible={showConfirm}
            onDismiss={() => setShowConfirm(false)}
            renderPannableHeader={(props) => {
              const { title } = props;
              return (
                <View>
                  <View margin-20>
                    <Text $textDefault>{title}</Text>
                  </View>
                  <View height={2} bg-grey70 />
                </View>
              );
            }}
            pannableHeaderProps={{
              title: dialogTitle,
            }}
          >
            {
              <View margin-20 marginH-30 spread row>
                <Button
                  text60
                  label="Abbrechen"
                  link
                  color={Colors.$backgroundDisabled}
                  onPress={() => setShowConfirm(false)}
                />
                <Button
                  text60
                  label="Ja"
                  link
                  color={Colors.$textDangerLight}
                  onPress={() => {
                    setShowConfirm(false);
                    if (
                      dialogTitle === "Wollen Sie den Nutzer wirklich bannen?"
                    ) {
                      setUserIsBanned(true);
                      banUser(userData?.uid);
                    } else {
                      deleteUser(props.route.params.userKey);
                      props.navigation.goBack();
                    }
                  }}
                />
              </View>
            }
          </Dialog>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  roundedDialog: {
    backgroundColor: Colors.$backgroundDefault,
    marginBottom: Constants.isIphoneX ? 0 : 20,
    borderRadius: 12,
  },
});
