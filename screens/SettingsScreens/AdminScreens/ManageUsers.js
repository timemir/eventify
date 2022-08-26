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
import { getAllUsers } from "../../../util/adminFunctions";
export default function ManageUsers(props) {
  const [allUsers, setAllUsers] = useState([]);
  // allUsers[0] => Array of user data with key and object as value
  // allUsers[0][0] => key
  // allUsers[0][1] => object with user data
  useEffect(() => {
    const data = getAllUsers();
    setAllUsers(data);
  }, []);

  // console.log(allUsers[0]);

  //RenderItem of FlashList
  function userCard({ item }) {
    return (
      <Card
        row
        key={item[1].uid}
        height={80}
        borderRadius={10}
        backgroundColor={Colors.secondaryColor}
        marginV-10
        center
        onPress={() =>
          props.navigation.navigate("manageUserDetails", {
            user: item[1],
            userKey: item[0],
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
          <Text
            white
            text60BO
          >{`${item[1].firstName} ${item[1].lastName} `}</Text>
        </View>
      </Card>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={Colors.secondaryColor}
          onPress={() => props.navigation.goBack()}
        />
        <View flex>
          <FlatList renderItem={userCard} data={allUsers} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
