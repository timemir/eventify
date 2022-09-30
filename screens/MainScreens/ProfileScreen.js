import { getDownloadURL, ref } from "firebase/storage";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import {
  BorderRadiuses,
  Button,
  Card,
  Carousel,
  Colors,
  GridList,
  Image,
  Spacings,
  Text,
  View,
} from "react-native-ui-lib";

import { auth, storage } from "../../store/firebase";
import {
  fetchUserById,
  getCreatedEventsById,
  getCreatedEventsInProfile,
} from "../../store/http";
import { categoryImage } from "../../util/categoriesImages";

export default function ProfileScreen(props) {
  const user = auth.currentUser;

  const [userData, setUserData] = useState(null);
  const [createdEventsIds, setCreatedEventsIds] = useState([]);
  const [createdEventsData, setCreatedEventsData] = useState([]);
  const [profilePicture, setProfilePicture] = useState("");
  const [helperState, setHelperState] = useState(false);
  useEffect(() => {
    const profilePicRef = ref(
      storage,
      "users/" + user.uid + "/profilePicture.jpg"
    );
    getDownloadURL(profilePicRef)
      .then((url) => {
        setProfilePicture(url);
        console.log(profilePicture);
      })
      .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/object-not-found":
            // File doesn't exist
            break;
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect the server response
            break;
        }
      });
  }, []);

  // Get UserData from Firebase
  async function getUserData() {
    try {
      // TODO: set fetchUserById to props.uid so we fetch the user we clicked on!
      // console.log(props.route.params);
      let userToFetch = "";
      if (props.route.params?.userId) {
        userToFetch = props.route.params.userId;
      } else {
        userToFetch = user.uid;
      }

      // console.log(userToFetch);
      const userData = await fetchUserById(userToFetch);
      setUserData(userData);
    } catch (error) {
      console.log(error);
    }
  }
  // console.log(props.route?.params);
  async function waitForHeaderUpdate() {
    props.navigation.setOptions({
      headerRight: () => {
        if (user.uid === userData?.uid) {
          return (
            <Pressable
              onPress={() =>
                props.navigation.navigate("editProfileScreen", {
                  userData: userData,
                })
              }
            >
              <Text marginR-5>Profil bearbeiten</Text>
            </Pressable>
          );
        }
      },
    });
  }
  useLayoutEffect(() => {
    async function loadUserData() {
      await getUserData();
    }
    loadUserData();
    // console.log(userData);
  }, []);

  useEffect(() => {
    // set the headerRight of props.navigation to a button that edits the profile if user.uid === userData.id
  }, []);

  // useEffect(() => {
  //   async function fetchCreatedEventsIds() {
  //     let array = await getCreatedEventsById(user.uid);
  //     // have to shift, because for some reason the first entry is "null"
  //     array?.shift();
  //     setCreatedEventsIds(array);
  //   }
  //   fetchCreatedEventsIds();

  //   // console.log(createdEventsIds);
  // }, []);

  // useEffect(() => {
  //   async function fetchCreatedEventsData() {
  //     let arraytwo = await getCreatedEventsInProfile(createdEventsIds);
  //     // console.log(arraytwo);

  //     setCreatedEventsData(arraytwo);
  //   }
  //   fetchCreatedEventsData();
  //   // console.log(createdEventsData);
  // }, []);
  async function waitForCreatedEventsIds() {
    getCreatedEventsById(user.uid).then((array) => {
      setCreatedEventsIds(array);
      getCreatedEventsInProfile(array).then((arrayTwo) => {
        setCreatedEventsData(arrayTwo);
      });
    });
  }
  async function waitForEvents() {
    let arraytwo = await getCreatedEventsInProfile(createdEventsIds);

    setCreatedEventsData(arraytwo);
  }
  useEffect(() => {
    waitForCreatedEventsIds();
    waitForEvents();
    getUserData();
    waitForHeaderUpdate();
  }, [helperState]);

  useEffect(() => {
    setHelperState(!helperState);
  }, []);
  function eventsCreatedBy({ item }) {
    return (
      <Card flex>
        <Card.Section
          imageSource={categoryImage[item.category.toLowerCase()]}
          imageStyle={{
            width: "100%",
            height: 85,
            borderRadius: BorderRadiuses.br10,
          }}
        />
        <View padding-s2>
          <Text $textDefault>{item.title}</Text>
          <Text $textDefault>{item.category}</Text>
        </View>
      </Card>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.white }}>
      <View flex marginB-60>
        {/* <ProfilePhoto />
      <Text>{`User ID: ${user.uid}`}</Text>
      <Text>{`Name: ${user.displayName}`}</Text>
      <Text>{`Email: ${user.email}`}</Text>
      <Text>{userData ? `City: ${userData.city.value}` : `City: No City`}</Text>
      <Text>Interests:</Text>
      {userData.interests ? (
        userData.interests?.map((interest) => {
          return <Text>{interest}</Text>;
        })
      ) : (
        <Text>No interests</Text>
      )} */}
        <View flex bg-grey70>
          <View
            flex
            bg-white
            marginT-100
            padding-20
            style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
          >
            {/* top = half of circle height/width; left = padding amount of top View */}
            <View width={"100%"} center abs style={{ top: -75, left: 20 }}>
              <View
                height={150}
                width={150}
                style={{ borderRadius: 75, overflow: "hidden" }}
              >
                <Image
                  source={{ uri: profilePicture }}
                  style={{ width: 150, height: 150 }}
                />
              </View>
            </View>
            <View center marginT-90>
              <Text
                text40BO
              >{`${userData?.firstName} ${userData?.lastName}`}</Text>
              <Text text80L>{`${
                userData?.city ? userData?.city.value : "Deutschland"
              }`}</Text>
            </View>
            <View marginT-40 center>
              <Text center text80BO>
                BESCHREIBUNGSTEXT: Dolor minim minim aute duis ex laborum
                excepteur voluptate. Cupidatat minim aliquip nisi ullamco
                pariatur cupidatat aute amet in adipisicing. Aute reprehenderit
                velit qui. Pariatur esse magna aliquip fugiat velit ut.
              </Text>
            </View>
            <View center marginT-15>
              {user.uid != userData?.uid ? (
                <Button
                  label="Follow"
                  backgroundColor={Colors.green50}
                  size={"large"}
                  avoidMinWidth
                  borderRadius={10}
                  onPress={() => {
                    console.log("followed");
                  }}
                />
              ) : null}
              <View stats></View>
            </View>
          </View>
          <View height={10} bg-grey70></View>
          <View flex bg-white padding-20>
            <View>
              <Text text60M>Interessen</Text>
              <View>
                <Carousel itemSpacings={0} pageWidth={150}>
                  {userData?.interests?.map((element, key) => {
                    return (
                      <View key={key} margin-12 width={150} center>
                        <View
                          width={80}
                          height={80}
                          style={{ borderRadius: 40, overflow: "hidden" }}
                          center
                        >
                          <Image
                            source={categoryImage[element.toLowerCase()]}
                            style={{ width: 80, height: 80 }}
                          />
                        </View>
                        <Text text80L center>{`${element}`}</Text>
                      </View>
                    );
                  })}
                </Carousel>
              </View>
            </View>
          </View>
          <View height={10} bg-grey70></View>
          <View flex bg-white padding-20>
            <View active Events>
              <Text text60M marginB-15>
                Events
              </Text>
              {createdEventsData.length !== 0 ? (
                <GridList
                  data={createdEventsData}
                  renderItem={eventsCreatedBy}
                  maxItemWidth={140}
                  numColumns={2}
                  itemSpacing={Spacings.s3}
                  listPadding={Spacings.s5}
                />
              ) : (
                <Text
                  text80L
                  marginT-15
                >{`${userData?.firstName} hat noch keinen Events erstellt.`}</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
