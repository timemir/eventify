import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../store/auth-context";

export default function LogOut() {
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    authCtx.logOut();
  }, []);

  return (
    <View>
      <Text>Spinner</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
