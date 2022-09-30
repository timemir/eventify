import React, { useEffect, useLayoutEffect, useState } from "react";
import { DeviceEventEmitter, SafeAreaView, StyleSheet } from "react-native";
import {
  Button,
  Colors,
  DateTimePicker,
  Picker,
  RadioButton,
  RadioGroup,
  Slider,
  Text,
  View,
} from "react-native-ui-lib";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fetchAllCategories } from "../../store/http";
export default function SearchFilter(props) {
  const [sliderValue, setSliderValue] = useState(5);
  const [teilnahmeValue, setTeilnahmeValue] = useState(true);
  const [dateStartValue, setDateStartValue] = useState("");
  const [dateEndValue, setDateEndValue] = useState("");
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [categoryValue, setCategoryValue] = useState([]);
  function onSliderValueChange(value) {
    setSliderValue(value);
  }

  useEffect(() => {
    return () => {
      DeviceEventEmitter.removeAllListeners("event. testEvent");
    };
  }, []);

  useLayoutEffect(() => {
    async function getCategories() {
      const categories = await fetchAllCategories();
      setFetchedCategories(categories);
    }
    getCategories();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View flex padding-20>
        <Text text50BO center>
          Filter
        </Text>
        <View
          height={150}
          marginV-10
          paddingT-5
          style={{ backgroundColor: Colors.greyBackgroundColor }}
        >
          <Text color="grey">Umgebung</Text>
          <View row centerV flex>
            <Slider
              onValueChange={onSliderValueChange}
              value={sliderValue}
              minimumValue={2}
              maximumValue={40}
              step={2}
              containerStyle={styles.sliderContainer}
              thumbTintColor={Colors.secondaryColor}
              minimumTrackTintColor={Colors.secondaryColor}
              disableRTL={true}
            />
            <Text bodySmall $textNeutral style={styles.text} numberOfLines={1}>
              {sliderValue} km
            </Text>
          </View>
        </View>
        <View
          height={150}
          marginV-10
          paddingT-5
          style={{ backgroundColor: Colors.greyBackgroundColor }}
        >
          <Text color="grey">Kategorie</Text>
          <View flex center>
            <Picker
              placeholder="Wähle Katgorien aus (bis zu 5)"
              value={categoryValue}
              mode={Picker.modes.MULTI}
              selectionLimit={5}
              onChange={(items) => {
                setCategoryValue(items);
              }}
              topBarProps={{ title: "Kategorien", useSafeArea: true }}
              migrateTextField
              style={{
                color: Colors.secondaryColor,
                fontSize: 18,
              }}
              fieldStyle={{ width: 300 }}
              showSearch
              useSafeArea={true}
              trailingAccessory={
                <Ionicons
                  name={"chevron-down-outline"}
                  size={24}
                  color={Colors.secondaryColor}
                />
              }
              searchPlaceholder={"Suche eine Kategorie"}
              searchStyle={{
                color: "#FAA353",
                placeholderTextColor: Colors.grey20,
              }}
            >
              {fetchedCategories.map((option, index) => {
                return (
                  <Picker.Item key={index} value={option} label={option} />
                );
              })}
            </Picker>
          </View>
        </View>
        <View
          height={150}
          marginV-10
          paddingT-5
          style={{ backgroundColor: Colors.greyBackgroundColor }}
        >
          <Text color="grey">Zeitraum</Text>
          <View flex centerV>
            <DateTimePicker
              placeholder={"Wähle ein Anfangsdatum aus"}
              mode={"date"}
              color={Colors.secondaryColor}
              value={dateStartValue}
              onChange={(value) => setDateStartValue(value)}
            />
            <DateTimePicker
              placeholder={"Wähle ein Enddatum aus"}
              mode={"date"}
              color={Colors.secondaryColor}
              value={dateEndValue}
              onChange={(value) => setDateEndValue(value)}
            />
          </View>
        </View>
        <View
          height={150}
          marginV-10
          paddingT-5
          style={{ backgroundColor: Colors.greyBackgroundColor }}
        >
          <Text color="grey">Teilnahme</Text>
          <View flex centerV>
            <RadioGroup
              initialValue={teilnahmeValue}
              onValueChange={(value) => {
                setTeilnahmeValue(value);
                console.log(teilnahmeValue);
              }}
            >
              <RadioButton
                color={Colors.secondaryColor}
                value={true}
                label={"Private Events"}
              />
              <RadioButton
                marginV-10
                color={Colors.secondaryColor}
                value={false}
                label={"Öffentliche Events"}
              />
            </RadioGroup>
          </View>
        </View>
      </View>
      <View row spread marginH-50>
        <Button br0 label="Reset" backgroundColor={Colors.grey50} />
        <Button
          label="Fertig"
          backgroundColor={Colors.secondaryColor}
          onPress={() => {
            const filter = {
              umgebung: sliderValue,
              kategorie: categoryValue,
              zeitraum: {
                start: dateStartValue,
                end: dateEndValue,
              },
              teilnahme: teilnahmeValue,
            };
            console.log(filter);
            DeviceEventEmitter.emit("onFilter", { filter });
            props.navigation.goBack();
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    flex: 1,
    marginHorizontal: 8,
    height: 80,
  },
});
