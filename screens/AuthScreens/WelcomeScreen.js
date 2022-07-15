import { Image, StyleSheet, Text, View, Button, Pressable } from "react-native";
import React from "react";
import ButtonDefault from "../../components/UI/ButtonDefault";
import ButtonAlt from "../../components/UI/ButtonAlt";
import Lottie from "lottie-react-native";

const WelcomeScreen = (props) => {
  return (
    <View style={styles.welcomeContainer}>
      <View>
        <Text style={styles.welcomeHeading}>Willkommen!</Text>
        <Text style={styles.welcomeSubheading}>
          Melde dich an oder erstelle einen Account.
        </Text>
      </View>
      <View>
        <Lottie
          source={require("../../assets/animations/confetti.json")}
          autoPlay
          loop
          style={styles.welcomeConfetti}
        />
        <Image source={require("../../assets/images/welcome.png")} />
      </View>
      <View style={styles.welcomeButtons}>
        <View style={styles.welcomeRegister}>
          <ButtonDefault
            title="Registrieren"
            onPress={() => {
              props.navigation.navigate("signup");
            }}
          />
        </View>
        <View style={styles.welcomeLogin}>
          <ButtonAlt
            title="Einloggen"
            onPress={() => {
              props.navigation.navigate("login");
            }}
          />
        </View>
        <View>
          {/* TODO: USER AUTH ANONYMOUS */}
          <Pressable
            style={({ pressed }) => pressed && styles.pressedButtonSkip}
          >
            <Text style={styles.welcomeSkip}>Als Gast fortfahren</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    justifyContent: "space-between",
    padding: 55,
    paddingTop: 105,
    paddingBottom: 48,
  },
  welcomeHeading: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
  },
  welcomeSubheading: {
    textAlign: "center",
    fontWeight: "400",
    color: "#7C7C7C",
  },
  welcomeRegister: {
    marginBottom: 11,
  },

  welcomeLogin: {
    marginBottom: 11,
  },
  welcomeSkip: {
    color: "#CBCBCB",
    textAlign: "center",
  },
  pressedButtonSkip: {
    opacity: 0.7,
  },
  welcomeConfetti: {
    zIndex: 1,
  },
});
