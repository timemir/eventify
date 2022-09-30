import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { database } from "../../../store/firebase";
// RNUILib
import { Avatar, Card, Colors, Text, View } from "react-native-ui-lib";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ManageUsers(props) {
  const [allUsers, setAllUsers] = useState([]);

  // MARK: allUsers[0] => Array of user data with key and object as value
  // MARK: allUsers[0][0] => key
  // MARK: allUsers[0][1] => object with user data
  //

  useEffect(() => {
    const usersFromDatabase = ref(database, "users/");

    onValue(usersFromDatabase, (snapshot) => {
      const data = snapshot.val();
      const dataOutput = Object.entries(data);
      setAllUsers(dataOutput);
    });
  }, []);

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
              uri: item[1]?.photo,
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
