import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { auth } from "../../store/firebase";
import ProfilePhoto from "../../components/Settings/ProfilePhoto";
import { fetchUserById } from "../../store/http";

export default function UserSettings() {
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);
  // Get UserData from Firebase
  async function getUserData() {
    try {
      const userData = await fetchUserById(user.uid);
      setUserData(userData);
    } catch (error) {
      console.log(error);
    }
  }

  useLayoutEffect(() => {
    getUserData();
    console.log(userData);
  }, []);

  return (
    <View>
      <ProfilePhoto />
      <Text>{`User ID: ${user.uid}`}</Text>
      <Text>{`Name: ${user.displayName}`}</Text>
      <Text>{`Email: ${user.email}`}</Text>
      <Text>{userData ? `City: ${userData.city.value}` : `City: No City`}</Text>
      <Text>Interests:</Text>
      {userData ? (
        userData.interests.map((interest) => {
          return <Text>{interest}</Text>;
        })
      ) : (
        <Text>No interests</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
