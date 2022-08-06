import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../store/auth-context";
import { getAuth, signOut } from "firebase/auth";

export default function LogOut() {
  // Firebase Authentication
  const auth = getAuth();
  // Global Store
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    signOut(auth)
      .then((response) => {
        authCtx.logOut();
      })
      .catch((error) => {
        console.log("Sign Out Error?");
        console.log(error);
      });
  }, []);

  return (
    <View>
      <Text>Spinner</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
