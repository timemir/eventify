import { StyleSheet } from "react-native";
import React, { useState } from "react";
import {
  Card,
  Text,
  Spacings,
  View,
  Button,
  Icon,
  Colors,
  GridList,
  BorderRadiuses,
  Picker,
  Image,
} from "react-native-ui-lib";

// Expo Image Picker for Uploading Photos
import * as ImagePicker from "expo-image-picker";

export default function PhotoUpload() {
  // Image State
  const [image, setImage] = useState(null);

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    // object{
    // "cancelled": bool,
    // "height": number,
    // "type": "image",
    // "uri": "string",
    // "width": number,
    //}

    if (!result.cancelled) {
      setImage(result.uri);
    }
  }
  return (
    <View flex center paddingT-80>
      <View center marginH-30>
        {!image && (
          <Image source={require("../../assets/images/PhotoUpload.png")} />
        )}
        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: 200, height: 200, borderRadius: 100 }}
          />
        )}
        <View marginV-20>
          <Text h1 center text50BL>
            Lade ein Foto von dir hoch!
          </Text>
        </View>
        <View>
          <Text center grey40>
            Schenke der Community ein Lächeln und zeige ihnen, wer Du bist!
          </Text>
        </View>
      </View>
      <View flex marginT-50 style={{ width: "80%" }}>
        <Button
          label={"Foto hochladen"}
          size={Button.sizes.large}
          backgroundColor={Colors.secondaryColor}
          borderRadius={10}
          onPress={pickImage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
