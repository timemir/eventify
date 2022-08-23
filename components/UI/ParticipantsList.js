import React from "react";
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

export default function ParticipantsList(props) {
  function renderItem({ item }) {
    return (
      <View flex row centerV marginV-5 key={item.userId}>
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
          enableShadow={false}
          marginL-10
          onPress={() => console.log("Go to their Profile Screen")}
        >
          <View>
            <Text text60>{`${item.userName}`}</Text>
          </View>
        </Card>
      </View>
    );
  }
  return (
    <View flex marginT-30 marginH-20>
      <Text center text40BO marginB-20>
        Teilnehmer
      </Text>
      <ScrollView style={{ flex: 1 }}>
        <FlatList
          data={props.route.params?.participants}
          renderItem={renderItem}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
