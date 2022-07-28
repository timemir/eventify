import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import React, { useContext } from "react";
import { GlobalStyles } from "../../util/GlobalColors";

// formik
import * as Yup from "yup";
import { Formik, ErrorMessage } from "formik";
import ButtonDefault from "../../components/UI/ButtonDefault";
import BackArrow from "../../components/UI/BackArrow";
import CircleSmall from "../../components/UI/CircleSmall";
// Firebase
import { auth } from "../../store/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// Context
import { AuthContext } from "../../store/auth-context";

// ----------------------------------------------------------------
export default function LoginScreen({ navigation }) {
  // Handle when pressing Registrieren
  function confirmHandler() {
    // TODO: Register user.
  }
  // Handle password resetting
  function forgotPasswordHandler() {
    // TODO: Do something with Firebase to reset password.
  }
  const authCtx = useContext(AuthContext);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <View style={styles.rootContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={require("../../assets/images/small.png")}
                style={styles.logo}
              />
            </View>
            <View style={styles.backArrow}>
              <BackArrow onPress={() => navigation.goBack()} />
            </View>
            <View style={styles.headingContainer}>
              <Text style={styles.heading}>Willkommen zurück!</Text>
            </View>
            <View style={{ flex: 1, width: "90%" }}>
              <Formik
                initialValues={{
                  email: "",

                  password: "",
                }}
                validationSchema={Yup.object({
                  email: Yup.string()
                    .email("Invalid Email")
                    .required("Required"),
                  password: Yup.string().required("Required"),
                })}
                onSubmit={(values, formikActions) => {
                  console.log(values);
                  signInWithEmailAndPassword(
                    auth,
                    values.email,
                    values.password
                  )
                    .then((userCredential) => {
                      // Signed in
                      const user = userCredential.user;
                      console.log(user);
                      // Changing global user state to logged in.
                      authCtx.signInUser();
                    })
                    .catch((error) => {
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      // TODO: Display Error message to user.
                      console.log(errorCode, errorMessage);
                    });

                  formikActions.setSubmitting(false);
                }}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  touched,
                  errors,
                }) => (
                  <>
                    <View style={styles.formContainer}>
                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>E-Mail</Text>
                        <TextInput
                          onChangeText={handleChange("email")}
                          onBlur={handleBlur("email")}
                          value={values.email}
                          style={styles.formInput}
                          placeholder="Gib hier deine Email-Adresse ein"
                          keyboardType="email-address"
                        />
                      </View>
                      {touched.email && errors.email ? (
                        <Text style={styles.error}>{errors.email}</Text>
                      ) : null}
                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Passwort</Text>
                        <TextInput
                          onChangeText={handleChange("password")}
                          onBlur={handleBlur("password")}
                          value={values.password}
                          style={styles.formInput}
                          placeholder="Gib hier deinen Passwort ein"
                          maxLength={18}
                          secureTextEntry={true}
                        />
                      </View>
                      {touched.password && errors.password ? (
                        <Text style={styles.error}>{errors.password}</Text>
                      ) : null}
                    </View>
                    <View style={styles.altLoginContainer}>
                      <Pressable
                        style={({ pressed }) => pressed && styles.pressed}
                        onPress={forgotPasswordHandler}
                      >
                        <Text style={styles.altLoginText}>
                          Passwort vergessen?
                        </Text>
                      </Pressable>
                    </View>
                    <View style={styles.altLoginLogoContainer}>
                      <CircleSmall
                        source={require("../../assets/images/googleLogoSmall.png")}
                      />
                      <CircleSmall
                        source={require("../../assets/images/appleLogoSmall.png")}
                      />
                    </View>
                    <View style={styles.buttonContainer}>
                      <ButtonDefault
                        title="Anmelden"
                        onPress={handleSubmit}
                      ></ButtonDefault>
                    </View>
                  </>
                )}
              </Formik>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: "90%",
    marginTop: 25,
  },
  formContainer: {
    flex: 1,
    width: "90%",
    height: "100%",
  },
  inputContainer: {
    marginBottom: 5,
  },
  formInput: {
    borderBottomWidth: 1,
    borderColor: GlobalStyles.colors.gray500,
    padding: 5,
    marginVertical: 4,
  },
  error: {
    margin: 8,
    fontSize: 14,
    color: "red",
    fontWeight: "bold",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    width: "100%",
  },
  logo: {
    width: 70,
    height: 70,
  },
  headingContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "90%",
    marginBottom: 50,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  backArrow: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 20,
  },
  label: {
    color: GlobalStyles.colors.gray500,
    fontWeight: "bold",
  },
  altLoginContainer: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  altLoginText: {
    fontWeight: "bold",
    color: GlobalStyles.colors.primary500,
    fontSize: 12,
  },
  altLoginLogoContainer: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  pressed: {
    opacity: 0.7,
  },
});
