import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
// RNUILib
import axios from "axios";
import {
  Button,
  Card,
  Colors,
  Incubator,
  Text,
  Toast,
  View,
} from "react-native-ui-lib";
import Ionicons from "react-native-vector-icons/Ionicons";
const { TextField } = Incubator;

export default function ManagePushIndi(props) {
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [finalValidationFailed, setFinalValidationFailed] = useState(false);
  const [sendSuccessfully, setSendSuccessfully] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);
  const [checkAllEntries, setCheckAllEntries] = useState(false);

  // Final Validation for the Button
  useEffect(() => {
    if (userId !== "" && title !== "" && body !== "") {
      setCheckAllEntries(false);
    } else {
      setCheckAllEntries(true);
    }
  }, [userId, title, body]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View flex>
        <Ionicons
          name="arrow-back"
          size={24}
          color={Colors.secondaryColor}
          onPress={() => props.navigation.goBack()}
        />
        <View flex margin-20 marginV-20>
          <Text text40BO marginB-40 center>
            Notification an einen bestimmten Nutzer
          </Text>
          {/* Inputfield - Notification Title */}
          <Card
            row
            padding-10
            height={80}
            center
            marginB-20
            style={{ backgroundColor: Colors.greyBackgroundColor }}
          >
            <TextField
              autoCapitalize={"sentences"}
              placeholder="Nutzer-ID"
              floatingPlaceholder
              floatingPlaceholderStyle={{
                color: "grey",
                opacity: 0.6,
                width: "100%",
              }}
              value={userId}
              onChangeText={(item) => setUserId(item)}
              containerStyle={{ flexGrow: 1 }}
              fieldStyle={{ maxWidth: "85%" }}
              color={Colors.secondaryColor}
              enableErrors
              validationMessage="Bitte gib eine Nutzer-ID an."
              validationMessagePosition="bottom"
              validate="required"
              validateOnBlur
              leadingAccessory={
                <Ionicons
                  name="person-circle-outline"
                  size={24}
                  color="grey"
                  style={{ marginRight: 20 }}
                />
              }
            />
          </Card>

          {/* Inputfield - Notification Title */}
          <Card
            row
            padding-10
            height={80}
            center
            marginB-20
            style={{ backgroundColor: Colors.greyBackgroundColor }}
          >
            <TextField
              autoCapitalize={"sentences"}
              placeholder="Titel der Notification"
              floatingPlaceholder
              floatingPlaceholderStyle={{
                color: "grey",
                opacity: 0.6,
                width: "100%",
              }}
              value={title}
              onChangeText={(item) => setTitle(item)}
              containerStyle={{ flexGrow: 1 }}
              fieldStyle={{ maxWidth: "85%" }}
              color={Colors.secondaryColor}
              enableErrors
              validationMessage="Bitte gib einen Titel an."
              validationMessagePosition="bottom"
              validate="required"
              validateOnBlur
              leadingAccessory={
                <Ionicons
                  name="reader-outline"
                  size={24}
                  color="grey"
                  style={{ marginRight: 20 }}
                />
              }
            />
          </Card>
          {/* Inputfield - Notification Body */}
          <Card
            row
            padding-10
            height={160}
            centerV
            marginB-20
            style={{ backgroundColor: Colors.greyBackgroundColor }}
          >
            <View flex>
              <TextField
                multiline
                autoCapitalize={"sentences"}
                placeholder="Inhalt der Notification"
                floatingPlaceholder
                floatingPlaceholderStyle={{
                  color: "grey",
                  opacity: 0.6,
                  width: "100%",
                }}
                value={body}
                style={{
                  height: 100,
                  minWidth: "100%",
                }}
                onChangeText={(item) => setBody(item)}
                containerStyle={{ flex: 1, flexGrow: 1 }}
                fieldStyle={{ maxWidth: "85%" }}
                color={Colors.secondaryColor}
                enableErrors
                validationMessage="Bitte gib einen Text an."
                validationMessagePosition="bottom"
                validate="required"
                validateOnBlur
                leadingAccessory={
                  <Ionicons
                    name="albums-outline"
                    size={24}
                    color="grey"
                    style={{ marginRight: 20 }}
                  />
                }
              />
            </View>
          </Card>
          {/* Submit Button */}
          <Button
            disabled={checkAllEntries}
            label={"Notification senden"}
            size={Button.sizes.large}
            backgroundColor={Colors.secondaryColor}
            borderRadius={10}
            onPress={async () => {
              if (userId != "" && title != "" && body != "") {
                try {
                  const response = await axios.post(
                    `https://app.nativenotify.com/api/notification`,
                    {
                      subID: userId,
                      appId: 3719,
                      appToken: "xT0Bt22NitQhc3dS8WidSr",
                      title: title,
                      body: body,
                      dateSent: new Date().toISOString,
                      //   pushData: { yourProperty: "yourPropertyValue" },
                    }
                  );
                  //   console.log(response);
                  console.log("Notification sent");
                  setTitle("");
                  setBody("");
                  setSendSuccessfully(true);
                } catch (error) {
                  console.log(error.response);
                  console.log("Notification not sent");
                  setSendFailed(true);
                }
              } else {
                setFinalValidationFailed(true);
              }
            }}
          />
          <Toast
            visible={finalValidationFailed}
            position={"top"}
            centerMessage={true}
            message="Bitte gib in jedem Feld Daten an."
            backgroundColor={Colors.$iconDanger}
            autoDismiss={5000}
            onDismiss={() => setFinalValidationFailed(false)}
          ></Toast>
          <Toast
            visible={sendSuccessfully}
            position={"top"}
            centerMessage={true}
            message="Notification erfolgreich gesendet."
            backgroundColor={Colors.$iconSuccess}
            autoDismiss={5000}
            onDismiss={() => setSendSuccessfully(false)}
          ></Toast>
          <Toast
            visible={sendFailed}
            position={"top"}
            centerMessage={true}
            message="FEHLER: Notification konnte nicht gesendet werden."
            backgroundColor={Colors.$iconDanger}
            autoDismiss={5000}
            onDismiss={() => setSendFailed(false)}
          ></Toast>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  withUnderline: {
    borderBottomWidth: 0,
    borderColor: Colors.$outlineDisabledHeavy,
    paddingBottom: 4,
  },
});
