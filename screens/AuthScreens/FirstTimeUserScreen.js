import { StyleSheet, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";

// RNUILib
import {
  Card,
  Text,
  Spacings,
  View,
  Button,
  FloatingButton,
  Icon,
  Colors,
  Wizard,
} from "react-native-ui-lib";
// Async Storage
import AsyncStorage from "@react-native-async-storage/async-storage";
// Custom Components
import InterestsLists from "../../components/FirstTimeUsers/InterestsLists";
import CitySelection from "../../components/FirstTimeUsers/CitySelection";
import PhotoUpload from "../../components/FirstTimeUsers/PhotoUpload";

// Navigation
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export default function FirstTimeUserScreen(props) {
  async function removeFirstTimeUserStatus() {
    try {
      await AsyncStorage.setItem("@first_time_user", "0");
      console.log("Set AsyncStorage successfully");
      props.navigation.goBack();
    } catch (error) {
      // saving error
      console.log(error);
    }
  }
  // Wizard States
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedStepIndex, setCompletedStepIndex] = useState(undefined);

  // Logic for showing the header
  function getStepState(index) {
    let state = Wizard.States.DISABLED;
    if (completedStepIndex > index - 1) {
      state = Wizard.States.COMPLETED;
    } else if (activeIndex === index || completedStepIndex === index - 1) {
      state = Wizard.States.ENABLED;
    }

    return state;
  }
  // ----------------------------------------------------------------

  // Switching Buttons
  function renderPrevButton() {
    return (
      <FloatingButton
        visible={true}
        hideBackgroundOverlay
        bottomMargin={3}
        button={{
          label: "Zurück",
          backgroundColor: Colors.secondaryColor,
          onPress: () => {
            const prevActiveIndex = activeIndex;
            if (prevActiveIndex === 0) {
              return;
            } else {
              setActiveIndex((prevState) => prevState - 1);
            }
          },
        }}
      />
    );
  }

  function renderNextButton(disabled) {
    const label = activeIndex === 2 ? "Fertig" : "Weiter";

    return (
      <FloatingButton
        visible={true}
        hideBackgroundOverlay
        bottomMargin={3}
        button={{
          label: label,
          disabled: disabled,
          backgroundColor: Colors.secondaryColor,
          onPress: () => {
            const prevActiveIndex = activeIndex;
            const prevCompletedStepIndex = completedStepIndex;

            const done = prevActiveIndex === 2;
            if (done) {
              finished();
              return;
            }

            setActiveIndex(prevActiveIndex + 1);
            setCompletedStepIndex(prevCompletedStepIndex);

            if (
              !prevCompletedStepIndex ||
              prevCompletedStepIndex < prevActiveIndex
            ) {
              setCompletedStepIndex(prevActiveIndex);
            }

            if (
              activeIndex !== prevActiveIndex ||
              completedStepIndex !== prevCompletedStepIndex
            ) {
              setActiveIndex(activeIndex);
              setCompletedStepIndex(completedStepIndex);
            }
          },
        }}
      />
    );
  }
  // ----------------------------------------------------------------
  // Switch Logic for Showing content
  function renderCurrentStep() {
    switch (activeIndex) {
      case 0:
      default:
        return renderInterests();
      case 1:
        return renderCity();
      case 2:
        return renderPhoto();
    }
  }

  // MAIN CONTENT
  // Interests Selection

  function childToParentInterests(childData) {
    const likedCategories = childData;
    console.log("likedCategories inside first time user screen");
    console.log(likedCategories);
  }

  function renderInterests() {
    const stopNextStep = false;
    return (
      <View style={styles.stepContainer}>
        {console.log(activeIndex)}
        <View flex marginV-15>
          <InterestsLists onChange={childToParentInterests} />
        </View>
        <View row spread>
          <View flex left></View>
          <View flex right>
            {renderNextButton(stopNextStep)}
          </View>
        </View>
      </View>
    );
  }
  // City Selection
  function childToParentCity(childData) {
    const selectedCity = childData;
    console.log(selectedCity);
  }

  function renderCity() {
    const stopNextStep = false;

    return (
      <View style={styles.stepContainer}>
        {console.log(activeIndex)}
        <CitySelection onChange={childToParentCity} />
        <Button label="Print" onPress={() => console.log(selectedCity)} />
        <View row spread>
          <View flex left>
            {renderPrevButton()}
          </View>
          <View flex right>
            {renderNextButton(stopNextStep)}
          </View>
        </View>
      </View>
    );
  }
  // Photo Upload
  function renderPhoto() {
    const stopNextStep = true;
    return (
      <View style={styles.stepContainer}>
        {console.log(activeIndex)}
        <PhotoUpload />
        <View row spread>
          <View flex left>
            {renderPrevButton()}
          </View>
          <View flex right>
            {renderNextButton(stopNextStep)}
          </View>
        </View>
      </View>
    );
  }

  // Executed after pressing "Fertig" in Step 3.
  function finished() {
    console.log("Done - Ship content");
    // TODO: Send Data to Firebase, Set AsyncStorage key "@first_time_user" to 0
    removeFirstTimeUserStatus();
  }

  // ----------------------------------------------------------------
  // Tab Bar Height Constant
  const tabBarHeight = useBottomTabBarHeight();

  // Main return
  return (
    <View useSafeArea flex style={{ marginBottom: tabBarHeight }}>
      <View flex-1>
        <Wizard
          activeIndex={activeIndex}
          onActiveIndexChanged={(activeIndex) => {
            setActiveIndex(activeIndex);
          }}
        >
          <Wizard.Step
            state={getStepState(0)}
            label={"Deine Interessen"}
            circleColor={Colors.secondaryColor}
            color={Colors.secondaryColor}
          />
          <Wizard.Step
            state={getStepState(1)}
            label={"Deine Stadt"}
            circleColor={Colors.secondaryColor}
            color={Colors.secondaryColor}
          />
          <Wizard.Step
            state={getStepState(2)}
            label={"Dein Foto"}
            circleColor={Colors.secondaryColor}
            color={Colors.secondaryColor}
          />
        </Wizard>
        {renderCurrentStep()}
        {/* <Button
          label={"Set First Time User Status to null"}
          size={Button.sizes.large}
          onPress={setFirstTimeUserStatus}
        /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    justifyContent: "space-between",
    // marginBottom: tabBarHeight,
  },
});
