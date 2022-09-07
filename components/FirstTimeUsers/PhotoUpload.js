import React, { useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import {
  BorderRadiuses,
  Button,
  Card,
  Colors,
  GridList,
  Icon,
  Image,
  Picker,
  Spacings,
  Text,
  Toast,
  View,
} from "react-native-ui-lib";

// Expo Image Picker for Uploading Photos
import * as ImagePicker from "expo-image-picker";
import { fetchProfilePicture, uploadImage } from "../../store/http";

export default function PhotoUpload(props) {
  // Image State
  const [image, setImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    // props.onChange(result);
    //! STRUCTURE OF THE "result" OBJECT!:
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
  // Data Transfer from PhotoUpload to FirstTimeUserScreen

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
      <Toast
        visible={imageUploaded}
        position={"top"}
        centerMessage={true}
        message="Foto erfolgreich hochgeladen"
        backgroundColor={Colors.$iconSuccess}
        autoDismiss={5000}
        onDismiss={() => console.log("Toast dismissed")}
      ></Toast>
      <View flex marginT-50 style={{ width: "80%" }}>
        <Button
          label={"Foto auswählen"}
          size={Button.sizes.large}
          disabled={uploadingImage}
          backgroundColor={Colors.secondaryColor}
          borderRadius={10}
          onPress={async () => {
            setImageUploaded(false);
            await pickImage();
          }}
        />
        {image &&
          (!uploadingImage ? (
            <Button
              label={"Foto hochladen"}
              marginT-20
              size={Button.sizes.large}
              disabled={imageUploaded}
              backgroundColor={Colors.secondaryColor}
              borderRadius={10}
              onPress={async () => {
                await uploadImage(
                  image,
                  "users",
                  props.user.uid.toString(),
                  "profilePicture",
                  setUploadingImage,
                  setImageUploaded
                );
                setTimeout(() => {
                  console.log(
                    "fetch profilepic url: ",
                    fetchProfilePicture(props.user.uid.toString())
                  );
                  fetchProfilePicture(props.user.uid.toString()).then((url) => {
                    props.onChange(url);
                  });
                }, 5000);
              }}
            />
          ) : (
            <View marginT-20>
              <ActivityIndicator />
            </View>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
