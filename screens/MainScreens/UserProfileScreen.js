import React, { useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
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
import Ionicons from "react-native-vector-icons/Ionicons";

import { auth } from "../../store/firebase";
import {
  fetchUserById,
  getCreatedEventsById,
  getCreatedEventsInProfile,
} from "../../store/http";
import { categoryImage } from "../../util/categoriesImages";

export default function UserProfileScreen(props) {
  const user = auth.currentUser;

  const [userData, setUserData] = useState(null);
  const [createdEventsIds, setCreatedEventsIds] = useState([]);
  const [createdEventsData, setCreatedEventsData] = useState([]);
  const [helperState, setHelperState] = useState(false);
  // Get UserData from Firebase
  async function getUserData() {
    try {
      let userToFetch = "";
      if (props.route.params?.userId) {
        userToFetch = props.route.params.userId;
      } else {
        userToFetch = user.uid;
      }

      const userData = await fetchUserById(userToFetch);
      setUserData(userData);
    } catch (error) {
      console.log(error);
    }
  }

  useLayoutEffect(() => {
    async function loadUserData() {
      await getUserData();
    }
    loadUserData();
    //console.log(userData);
  }, []);

  // useEffect(() => {
  //   async function fetchCreatedEventsIds() {
  //     let array = await getCreatedEventsById(props.route.params.userId);
  //     // have to shift, because for some reason the first entry is "null"
  //     array?.shift();
  //     setCreatedEventsIds(array);
  //   }
  //   fetchCreatedEventsIds();

  //   // console.log(createdEventsIds);
  // }, [props.route.params.userId]);

  async function waitForCreatedEventsIds() {
    getCreatedEventsById(props.route.params.userId).then((array) => {
      setCreatedEventsIds(array);
      getCreatedEventsInProfile(array).then((arrayTwo) => {
        setCreatedEventsData(arrayTwo);
      });
    });
  }
  // useEffect(() => {
  //   async function fetchCreatedEventsData() {
  //     let arraytwo = await getCreatedEventsInProfile(createdEventsIds);
  //     //   console.log(arraytwo);

  //     setCreatedEventsData(arraytwo);
  //   }
  //   fetchCreatedEventsData();
  //   // console.log(createdEventsData);
  // }, [createdEventsIds]);
  async function waitForEvents() {
    let arraytwo = await getCreatedEventsInProfile(createdEventsIds);

    setCreatedEventsData(arraytwo);
  }
  useEffect(() => {
    waitForCreatedEventsIds();
    waitForEvents();
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
      <View flex marginB-60 bg-grey70>
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

        <View
          flex
          bg-white
          marginT-100
          padding-20
          style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
        >
          <View style={{ position: "absolute", left: 15, top: 15, zIndex: 10 }}>
            <Ionicons
              onPress={() => props.navigation.goBack()}
              name="arrow-back-outline"
              size={32}
              color={Colors.secondaryColor}
              style={{ marginRight: 20 }}
            />
          </View>
          {/* top = half of circle height/width; left = padding amount of top View */}
          <View width={"100%"} center abs style={{ top: -55, left: 20 }}>
            <View
              height={150}
              width={150}
              style={{
                borderRadius: 75,
                overflow: "hidden",
                backgroundColor: "grey",
                zIndex: 100,
              }}
            >
              <Image
                source={{ uri: userData?.photo }}
                style={{ width: 150, height: 150 }}
              />
            </View>
          </View>
          <View flex>
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
            <View center marginV-15>
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
