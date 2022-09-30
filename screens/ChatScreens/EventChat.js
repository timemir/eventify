import { child, get, onValue, ref } from "firebase/database";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

import { Colors, Incubator } from "react-native-ui-lib";
import Ionicons from "react-native-vector-icons/Ionicons";
import { auth, database } from "../../store/firebase";
import { addToChat } from "../../util/chatFunctions";
// Navigation
import { useIsFocused } from "@react-navigation/native";
const { TextField } = Incubator;

export default function EventChat(props) {
  // const germanLocale = require("dayjs/locale/de");
  const isFocused = useIsFocused();
  const [messages, setMessages] = useState([]);
  const [eventKey, setEventKey] = useState(null);
  //
  //
  useEffect(() => {
    const dbRef = ref(database);

    get(child(dbRef, `events/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // console.log(snapshot.val());
          const data = snapshot.val();
          const dataOutput = Object.entries(data);
          const foundEventKey = dataOutput.find(
            (entry) => entry[1].createdOn === props.route.params.createdOn
          )[0];

          setEventKey(foundEventKey);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [props.route.params?.createdOn]);
  //
  //
  useLayoutEffect(() => {
    // console.log(getChat(eventKey));
    //setMessages(getChat(eventKey)?.reverse());
    //console.log("eventkey: ", eventKey);
    const chatRef = ref(database, "chats/" + eventKey);
    onValue(chatRef, (snapshot) => {
      let dataX;
      // console.log(snapshot.val());
      if (snapshot.val() !== null) {
        dataX = snapshot.val();
      } else {
        dataX = [];
      }
      const chatOutput = Object.values(dataX);
      setMessages(chatOutput?.reverse());
    });
  }, [eventKey]);

  //
  //
  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
    addToChat(eventKey, {
      _id,
      createdAt,
      text,
      user,
    });
  });
  if (eventKey === null) {
    return (
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <ActivityIndicator size={"large"}></ActivityIndicator>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Ionicons
        onPress={() => props.navigation.goBack()}
        name="arrow-back-outline"
        size={24}
        color={Colors.secondaryColor}
        style={{ marginRight: 20 }}
      />

      <GiftedChat
        placeholder="Sende eine Nachricht an die Eventgruppe..."
        messages={messages}
        locale={"de"}
        showAvatarForEveryMessage={true}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: auth?.currentUser?.uid,
          name: auth?.currentUser?.displayName,
          avatar: props.route.params?.photo,
        }}
        renderUsernameOnMessage={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
