import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Carousel,
  Colors,
  ExpandableSection,
  Image,
  Incubator,
  Spacings,
  Text,
  View,
} from "react-native-ui-lib";
import { auth } from "../../store/firebase";
import { removeRequester, updateParticipants } from "../../store/http";
export default function ParticipantsList(props) {
  // Have to remove first entry, because it is always empty
  const [participants, setParticipants] = useState([]);
  const [profilePictures, setProfilePictures] = useState([]);
  const [counter, setCounter] = useState(false);
  const [entryRequests, setEntryRequests] = useState([]);
  const [currentUserIsCreator, setCurrentUserIsCreator] = useState(false);

  useEffect(() => {
    setParticipants(props.route.params?.participants);
  }, []);

  useEffect(() => {
    if (props.route.params?.entryRequests?.length > 1) {
      props.route.params?.entryRequests?.shift();
      setEntryRequests(props.route.params.entryRequests);
    }
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (user.uid === props.route.params.creator) {
      setCurrentUserIsCreator(true);
    }
  }, []);

  function renderItem({ item }) {
    console.log("test");
    return (
      <View flex row centerV marginV-5 key={item.userID}>
        <Avatar
          containerStyle={{}}
          size={60}
          source={{
            uri: "https://lh3.googleusercontent.com/-cw77lUnOvmI/AAAAAAAAAAI/AAAAAAAAAAA/WMNck32dKbc/s181-c/104220521160525129167.jpg",
          }}
          label={"IT"}
        />
        <Card
          flex
          row
          enableShadow={false}
          marginL-10
          onPress={() => {
            props.navigation.goBack();
            props.navigation.navigate("userProfileScreen", {
              userId: item.userID,
            });
          }}
        >
          <View center>
            <Text text60>{`${item?.userName}`}</Text>
          </View>
        </Card>
      </View>
    );
  }

  function renderItemRequests({ item }) {
    return (
      <View flex row centerV marginV-5 key={item.userID}>
        <Avatar
          containerStyle={{}}
          size={60}
          source={{
            uri: "https://lh3.googleusercontent.com/-cw77lUnOvmI/AAAAAAAAAAI/AAAAAAAAAAA/WMNck32dKbc/s181-c/104220521160525129167.jpg",
          }}
          label={"IT"}
        />

        <Card
          flex
          row
          enableShadow={false}
          marginL-10
          onPress={() => {
            props.navigation.goBack();
            props.navigation.navigate("userProfileScreen", {
              userId: item.userID,
            });
          }}
        >
          <View center>
            <Text text60>{`${item?.userName}`}</Text>
          </View>
        </Card>

        <View flex>
          <Button
            flex
            label="Annehmen"
            onPress={() => {
              console.log("Request angenommen");
              removeRequester(props.route.params.eventId, item.userID);
              updateParticipants(
                props.route.params.eventId,
                item.userID,
                item?.userName
              );
              setParticipants([...participants, item]);
              setEntryRequests(
                entryRequests.filter((entry) => entry.userID != item.userID)
              );
              // TODO: Send Notification to User that request was accepted
            }}
            size={Button.sizes.small}
            borderRadius={10}
            backgroundColor={Colors.green30}
            marginB-1
            marginT-1
          />
          <Button
            flex
            label="Ablehnen"
            onPress={() => {
              console.log("Request abgelehnt");
              removeRequester(props.route.params.eventId, item.userID);
              // TODO: Send notification to user that request was rejected
            }}
            size={Button.sizes.small}
            borderRadius={10}
            backgroundColor={Colors.red30}
            marginT-1
            marginB-1
          />
        </View>
      </View>
    );
  }
  return (
    <View flex marginT-30 marginH-20>
      <Text center text40BO marginB-20>
        Teilnehmer
      </Text>
      <ScrollView style={{ flex: 1 }}>
        <FlatList data={participants} renderItem={renderItem} />
      </ScrollView>
      {currentUserIsCreator && props.route.params.entryRequests.length >= 1 && (
        <View flex>
          <Text center text40BO marginB-20>
            Anfragen
          </Text>
          <ScrollView style={{ flex: 1 }}>
            <FlatList data={entryRequests} renderItem={renderItemRequests} />
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
