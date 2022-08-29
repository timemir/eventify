import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, ScrollView, StyleSheet } from "react-native";
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
  Text,
  View,
} from "react-native-ui-lib";
import Ionicons from "react-native-vector-icons/Ionicons";
// Navigation
import { useIsFocused } from "@react-navigation/native";
import { auth } from "../../../store/firebase";
import { getAllEvents } from "../../../util/adminFunctions";
export default function ManageEvents(props) {
  const [allEvents, setAllEvents] = useState([]);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      const events = getAllEvents();
      setAllEvents(events);
    }
  }, [isFocused]);

  //RenderItem of FlashList
  function eventCard({ item }) {
    return (
      <Card
        row
        key={item[1].createdOn}
        height={80}
        borderRadius={10}
        backgroundColor={Colors.secondaryColor}
        marginV-10
        center
        onPress={() =>
          props.navigation.navigate("manageEventDetails", {
            event: item[1],
            eventKey: item[0],
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
          <Text white text60BO>{`${item[1].title}`}</Text>
          <Text white text60BO>{`created by: ${item[1].user.userName}`}</Text>
        </View>
      </Card>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View flex>
        <Ionicons
          name="arrow-back"
          size={24}
          color={Colors.secondaryColor}
          onPress={() => props.navigation.goBack()}
        />
        <View>
          <FlatList renderItem={eventCard} data={allEvents} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
