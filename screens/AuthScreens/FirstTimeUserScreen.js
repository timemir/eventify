import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";

// RNUILib
import {
  Button,
  Card,
  Colors,
  FloatingButton,
  Icon,
  Spacings,
  Text,
  View,
  Wizard,
} from "react-native-ui-lib";
// Async Storage
import AsyncStorage from "@react-native-async-storage/async-storage";
// Custom Components
import CitySelection from "../../components/FirstTimeUsers/CitySelection";
import InterestsLists from "../../components/FirstTimeUsers/InterestsLists";
import PhotoUpload from "../../components/FirstTimeUsers/PhotoUpload";

// HTTP Requests
import axios from "axios";
import { updateFirstTimeUserById } from "../../store/http";

// Firebase Auth
import { getAuth } from "firebase/auth";
import { auth } from "../../store/firebase";

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
  // Selection States
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState({});

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

  function childToParentInterests(likedCategoriesArray) {
    setSelectedInterests([...likedCategoriesArray]);
  }

  function renderInterests() {
    const stopNextStep = false;
    return (
      <View style={styles.stepContainer}>
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
    setSelectedCity(childData);
  }

  function renderCity() {
    const stopNextStep = false;
    return (
      <View style={styles.stepContainer}>
        {console.log(activeIndex)}
        <CitySelection onChange={childToParentCity} />
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
  function childToParentPhoto(childData) {
    setSelectedPhoto(childData);
  }
  function renderPhoto() {
    const stopNextStep = false;
    const user = auth.currentUser;

    return (
      <View style={styles.stepContainer}>
        {console.log(activeIndex)}
        <PhotoUpload user={user} onChange={childToParentPhoto} />
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
    removeFirstTimeUserStatus();

    // TODO: Send Data to Firebase
    const firstTimeUserData = {
      interests: selectedInterests,
      city: selectedCity,
      photo: selectedPhoto,
    };
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.uid;
    updateFirstTimeUserById(uid, firstTimeUserData);
  }

  // ----------------------------------------------------------------

  // Main return
  return (
    <View useSafeArea style={{ marginBottom: 50 }} flex>
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
  },
});
