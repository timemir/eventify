import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
// RNUILib
import {
  Button,
  Colors,
  Constants,
  Dialog,
  Text,
  View,
} from "react-native-ui-lib";
import Ionicons from "react-native-vector-icons/Ionicons";
import { deleteEvent } from "../../../util/adminFunctions";

export default function ManageEventDetails(props) {
  const [eventData, setEventData] = useState(null);
  const [dialogTitle, setDialogTitle] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setEventData(props.route.params.event);
  }, [props.route.params.event, eventData]);

  function contactHandler() {
    console.log("contactHandler");
  }

  function deleteHandler() {
    setDialogTitle("Wollen Sie das Event wirklich löschen?");
    setShowConfirm(true);
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
          Event Daten
        </Text>
        <Text>{`Titel: ${eventData?.title}`}</Text>
        <Text>{`Datum: ${eventData?.date} `}</Text>
        <Text>{`EID   : ${props.route.params.eventKey} `}</Text>
        <Text>{`created by: ${eventData?.user.userName} `}</Text>
        <Text>{`UID: ${eventData?.user.userID} `}</Text>
        <Text>{`Private Status: ${eventData?.private} `}</Text>
        <Text text40BO marginV-15>
          Event verwalten
        </Text>
        <View flex>
          <Button
            marginV-5
            borderRadius={10}
            label="Event Organisator kontaktieren"
            backgroundColor={Colors.secondaryColor}
            onPress={contactHandler}
          />
          <Button
            marginV-5
            marginT-50
            borderRadius={10}
            label="Event löschen"
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

                    deleteEvent(props.route.params.eventKey);
                    props.navigation.goBack();
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
