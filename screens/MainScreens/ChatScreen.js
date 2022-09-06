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
import { fetchParticipatingEvents } from "../../store/http";
// Navigation
import { useIsFocused } from "@react-navigation/native";
import { auth } from "../../store/firebase";
const { TextField } = Incubator;
export default function ChatScreen(props) {
  const [eventsOfUser, setEventsOfUser] = useState([]);
  // Navigation Stuff
  const isFocused = useIsFocused();

  useEffect(() => {
    const user = auth.currentUser;
    async function getEventsOfUser() {
      const events = await fetchParticipatingEvents(user.uid);
      setEventsOfUser(events);
    }

    if (isFocused) {
      getEventsOfUser();
      // console.log("eventsOfUser", eventsOfUser);
    }
  }, [isFocused]);

  function renderItem({ item }) {
    return (
      <Card
        row
        key={item.title}
        height={80}
        borderRadius={10}
        backgroundColor={Colors.greyBackgroundColor}
        marginV-10
        center
        onPress={() =>
          props.navigation.navigate("eventChat", {
            createdOn: item.createdOn,
          })
        }
      >
        <View marginL-5>
          <Avatar
            source={{
              uri: "https://lh3.googleusercontent.com/-cw77lUnOvmI/AAAAAAAAAAI/AAAAAAAAAAA/WMNck32dKbc/s181-c/104220521160525129167.jpg",
            }}
            label={"IT"}
          />
        </View>
        <View flex padding-10>
          <Text black text60BO>{`${item.title}`}</Text>
        </View>
      </Card>
    );
  } // renderItem
  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 20 }}>
      <View flex>
        <View>
          {eventsOfUser.length > 0 ? (
            <FlatList renderItem={renderItem} data={eventsOfUser} />
          ) : (
            <View center marginT-300>
              <Text center text50 grey30>
                Tritt einem Event bei, um die Gruppenchats zu sehen!
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {},
});
