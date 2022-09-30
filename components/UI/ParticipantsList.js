import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet } from "react-native";
import { Avatar, Button, Card, Colors, Text, View } from "react-native-ui-lib";
import { auth } from "../../store/firebase";
import {
  fetchPhotoById,
  removeRequester,
  updateParticipants,
} from "../../store/http";
export default function ParticipantsList(props) {
  // Have to remove first entry, because it is always empty
  const [participants, setParticipants] = useState([]);
  // [{userID, userName}]
  //
  const [entryRequests, setEntryRequests] = useState([]);
  const [currentUserIsCreator, setCurrentUserIsCreator] = useState(false);
  const [participantsPlusPhoto, setParticipantsPlusPhoto] = useState([]);
  const [entryRequestsPlusPhoto, setEntryRequestsPlusPhoto] = useState([]);
  const [helperState, setHelperState] = useState(false);

  async function waitForPhotos() {
    participants.map(async (participant) => {
      // fetch photo from database for each participant
      fetchPhotoById(participant.userID).then((url) => {
        setParticipantsPlusPhoto((prev) => [
          ...prev,
          { ...participant, photo: url },
        ]);
        console.log("FETCHED URL");
      });
    });
    entryRequests.map(async (participant) => {
      // fetch photo from database for each participant
      fetchPhotoById(participant.userID).then((url) => {
        setEntryRequestsPlusPhoto((prev) => [
          ...prev,
          { ...participant, photo: url },
        ]);
        console.log("FETCHED URL");
      });
    });
  }
  useEffect(() => {
    setParticipants(props.route.params?.participants);
  }, []);

  useEffect(() => {
    waitForPhotos();
  }, [helperState]);

  useEffect(() => {
    setHelperState(!helperState);
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
    return (
      <View flex row centerV marginV-5 key={item.userID}>
        <Avatar
          containerStyle={{}}
          size={60}
          source={{
            uri: item?.photo,
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
    {
      //console.log("rendering Component");
      //console.log(entryRequestsPlusPhoto);
      // console.log(item.userID);
    }
    return (
      <View flex row centerV marginV-5 key={item.userID}>
        <Avatar
          containerStyle={{}}
          size={60}
          source={{
            uri: item?.photo,
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
              setParticipantsPlusPhoto([...participants, item]);
              setEntryRequestsPlusPhoto(
                entryRequestsPlusPhoto.filter(
                  (entry) => entry.userID != item.userID
                )
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
              setEntryRequestsPlusPhoto(
                entryRequestsPlusPhoto.filter(
                  (entry) => entry.userID != item.userID
                )
              );
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
        <FlatList data={participantsPlusPhoto} renderItem={renderItem} />
      </ScrollView>
      {currentUserIsCreator && props.route.params.entryRequests.length >= 1 && (
        <View flex>
          <Text center text40BO marginB-20>
            Anfragen
          </Text>
          <ScrollView style={{ flex: 1 }}>
            <FlatList
              data={entryRequestsPlusPhoto}
              renderItem={renderItemRequests}
            />
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
