import React, { useLayoutEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

import { auth } from "../../store/firebase";
import { fetchUserById } from "../../store/http";

//
export default function ProfileCircleSmall(props) {
  const [profilePhotoPath, setProfilePhotoPath] = useState("");
  // Get photo data from Firebase
  const user = auth.currentUser;
  async function getUserPhoto() {
    try {
      const userData = await fetchUserById(user.uid);
      if (userData.photo.uri) {
        setProfilePhotoPath(userData.photo.uri);
      } else {
        console.log("No Photo Uploaded - Using Default Avatar");
      }
    } catch (error) {
      console.log(error);
    }
  }
  useLayoutEffect(() => {
    getUserPhoto();
  }, []);

  return (
    <View>
      <Pressable onPress={props.onPress}>
        <View style={styles.imageContainer}>
          {profilePhotoPath !== "" ? (
            <Image source={{ uri: profilePhotoPath }} style={styles.image} />
          ) : (
            <Image
              source={require("../../assets/images/defaultAvatar.png")}
              style={styles.image}
            />
          )}
        </View>
      </Pressable>
    </View>
  );
}
const IMAGE_SIZE = 150;
const styles = StyleSheet.create({
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    // borderRadius: IMAGE_SIZE / 2,
    overflow: "hidden",
    margin: 10,
    marginBottom: 15,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
});
