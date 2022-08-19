import React, { useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import {
  BorderRadiuses,
  Button,
  Card,
  Carousel,
  Colors,
  Constants,
  DateTimePicker,
  Dialog,
  GridList,
  Image,
  Incubator,
  KeyboardTrackingView,
  LoaderScreen,
  Picker,
  Spacings,
  Text,
  Toast,
  View,
} from "react-native-ui-lib";
import ProfilePhoto from "../../components/Settings/ProfilePhoto";
import { auth } from "../../store/firebase";
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
  // Get UserData from Firebase
  async function getUserData() {
    try {
      // TODO: set fetchUserById to props.uid so we fetch the user we clicked on!
      const userData = await fetchUserById(user.uid);
      setUserData(userData);
    } catch (error) {
      console.log(error);
    }
  }

  useLayoutEffect(() => {
    getUserData();
    // console.log(userData);
  }, []);

  const DUMMY_ARRAY = [
    "Sport",
    "stadtDORTMUND",
    "Schwimmen",
    "Rennen",
    "Tauchen",
    "Schach",
    "Yoga",
  ];
  useEffect(() => {
    async function fetchCreatedEventsIds() {
      let array = await getCreatedEventsById(user.uid);
      // have to shift, because for some reason the first entry is "null"
      array.shift();
      setCreatedEventsIds(array);
    }
    fetchCreatedEventsIds();

    console.log(createdEventsIds);
  }, []);

  useEffect(() => {
    async function fetchCreatedEventsData() {
      let arraytwo = await getCreatedEventsInProfile(createdEventsIds);
      console.log(arraytwo);

      setCreatedEventsData(arraytwo);
    }
    fetchCreatedEventsData();
    // console.log(createdEventsData);
  }, []);

  function eventsCreatedBy({ item }) {
    return (
      <Card flex>
        <Card.Section
          imageSource={{ uri: "../../assets/images/citySelection.png" }}
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
                bg-blue20
                style={{ borderRadius: 75, overflow: "hidden" }}
              >
                <Image
                  source={{ uri: userData?.photo?.uri }}
                  style={{ width: 150, height: 150 }}
                />
              </View>
            </View>
            <View center marginT-90>
              <Text
                text40BO
              >{`${userData?.firstName} ${userData?.lastName}`}</Text>
              <Text text80L>{`${
                userData?.city ? userData?.city : "Deutschland"
              }`}</Text>
            </View>
            <View marginT-40 center>
              <Text center text80BO>
                Ich bin Tim und komme aus Dortmund. Folge mir, um zu sehen was
                ich alles so in meiner Stadt unternehme!
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
