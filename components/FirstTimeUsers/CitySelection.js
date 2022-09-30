import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Colors, Image, Picker, Text, View } from "react-native-ui-lib";

import { cities } from "../../util/cities.js";

export default function CitySelection(props) {
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    props.onChange(selectedCity);
  }, [selectedCity]);

  return (
    <View flex center paddingT-100>
      <View center marginH-30>
        <Image source={require("../../assets/images/citySelection.png")} />
        <View marginV-20>
          <Text h1 center text50BL>
            Suche deine Stadt aus!
          </Text>
        </View>
        <View>
          <Text center grey40>
            Lass uns das nächstes Event in deiner Nähe finden und bleibe immer
            auf dem Laufenden darüber was in deiner Region passiert.
          </Text>
        </View>
      </View>
      <View flex style={styles.pickerContainer}>
        <Picker
          placeholder="Stadt auswählen"
          floatingPlaceholderStyle={{
            color: "white",
            width: "100%",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
          value={selectedCity}
          enableModalBlur={false}
          onChange={(item) => {
            setSelectedCity(item);
          }}
          topBarProps={{ title: "Städte", useSafeArea: true }}
          migrateTextField
          style={{
            // color: Colors.secondaryColor,
            fontSize: 18,
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            backgroundColor: Colors.secondaryColor,
            textAlign: "center",
            height: 50,
            borderRadius: 10,
          }}
          fieldStyle={{ width: 300 }}
          showSearch
          useSafeArea={true}
          searchPlaceholder={"Suche deine Stadt"}
          searchStyle={{
            color: "#FAA353",
            placeholderTextColor: Colors.grey20,
          }}
        >
          {cities.map((option, index) => (
            <Picker.Item key={index} value={option} label={option} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "green",
    height: "auto",
    borderRadius: 10,
  },
});
