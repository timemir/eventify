import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";

import {
  Avatar,
  Card,
  Colors,
  Incubator,
  Text,
  View,
} from "react-native-ui-lib";

import { fetchParticipatingEvents, fetchPhotoById } from "../../store/http";
// Navigation
import { useIsFocused } from "@react-navigation/native";
import { auth } from "../../store/firebase";
const { TextField } = Incubator;
export default function ChatScreen(props) {
  const [eventsOfUser, setEventsOfUser] = useState([]);
  const [photoOfUser, setPhotoOfUser] = useState("");
  // Navigation Stuff
  const isFocused = useIsFocused();

  useEffect(() => {
    const user = auth.currentUser;
    async function getEventsOfUser() {
      const events = await fetchParticipatingEvents(user.uid);
      setEventsOfUser(events);
    }
    async function getUserPhoto() {
      const photo = await fetchPhotoById(user.uid);
      setPhotoOfUser(photo);
    }

    if (isFocused) {
      getEventsOfUser();
      getUserPhoto();
      console.log("eventsOfUser", eventsOfUser);
      console.log("photoOfUser", photoOfUser);
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
            photo: photoOfUser,
          })
        }
      >
        <View marginL-5>
          <Avatar
            source={require("../../assets/images/small.png")}
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
        <View flex>
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
