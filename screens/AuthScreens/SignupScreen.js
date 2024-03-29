import React, { useContext } from "react";
import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { GlobalStyles } from "../../util/GlobalColors";
// Notifications Registration
import { registerIndieID } from "native-notify";

// formik
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { ErrorMessage, Formik } from "formik";
import * as Yup from "yup";
import BackArrow from "../../components/UI/BackArrow";
import ButtonDefault from "../../components/UI/ButtonDefault";
import CircleSmall from "../../components/UI/CircleSmall";
import { AuthContext } from "../../store/auth-context";
import { auth } from "../../store/firebase";
// axios HTTP Requests
import axios from "axios";

// Async Storage to store first time user created
import AsyncStorage from "@react-native-async-storage/async-storage";

// ----------------------------------------------------------------
export default function SignupScreen({ navigation }) {
  // Handle when pressing Registrieren
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
              <Text style={styles.heading}>Erstelle einen neuen Account</Text>
            </View>
            <View style={{ flex: 1, width: "90%" }}>
              <Formik
                initialValues={{
                  firstName: "",
                  lastName: "",
                  email: "",
                  emailConfirmation: "",
                  password: "",
                  passwordConfirmation: "",
                }}
                validationSchema={Yup.object({
                  firstName: Yup.string().required("Bitte ausfüllen"),
                  lastName: Yup.string().required("Bitte ausfüllen"),
                  email: Yup.string()
                    .email("ungültige E-Mail")
                    .required("Bitte ausfüllen"),
                  emailConfirmation: Yup.string().oneOf(
                    [Yup.ref("email"), null],
                    "Emails must match"
                  ),
                  password: Yup.string()
                    .min(6, "Dein Passwort muss mindestens 6 Zeichen haben.")
                    .required("Bitte ausfüllen"),
                  passwordConfirmation: Yup.string().oneOf(
                    [Yup.ref("password"), null],
                    "Passwörter müssen übereinstimmen"
                  ),
                })}
                onSubmit={(values, formikActions) => {
                  createUserWithEmailAndPassword(
                    auth,
                    values.email,
                    values.password
                  )
                    .then((userCredential) => {
                      // Logged In
                      const user = userCredential.user;
                      // console.log(user);
                      // user.displayName = `${values.firstName} ${values.lastName}`;
                      const authCurrent = getAuth();
                      updateProfile(authCurrent.currentUser, {
                        displayName: `${values.firstName} ${values.lastName}`,
                      })
                        .then(() => console.log("Profile Name Set"))
                        .catch((error) => console.log(error));

                      // Sending User data to global context to use app-wide.
                      authCtx.createUser(
                        user.uid,
                        values.firstName,
                        values.lastName,
                        user.email,
                        user.emailVerified,
                        user
                      );
                      const userObject = {
                        uid: user.uid,
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: user.email,
                        emailVerified: user.emailVerified,
                        city: "",
                        interests: [],
                        photo: {},
                        isAdmin: false,
                      };
                      // Sending User data to Firebase
                      axios
                        .post(
                          "https://eventify-43747-default-rtdb.europe-west1.firebasedatabase.app/users.json",
                          userObject
                        )
                        .then(function (response) {
                          console.log(response);
                        })
                        .catch(function (error) {
                          console.log(error);
                          console.log("(Fehler) Keine Verbindung zum Server");
                        });
                      // Registration for Notifications
                      registerIndieID(user.uid, 3719, "xT0Bt22NitQhc3dS8WidSr");
                    })
                    .catch((error) => {
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      // TODO: Display Error message to user.
                      console.log(errorCode, errorMessage);
                    });

                  // Store first time user variable in async storage
                  const setFirsttimeUser = async (value) => {
                    try {
                      await AsyncStorage.setItem("@first_time_user", value);
                      console.log("Set AsyncStorage successfully");
                      console.log(value);
                    } catch (error) {
                      // saving error
                      console.log(error);
                    }
                  };
                  setFirsttimeUser("1");
                  formikActions.setSubmitting(false);
                  // TODO: do not just navigate back, but create a loading spinner.
                  navigation.goBack();
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
                        <Text style={styles.label}>Vorname</Text>
                        <TextInput
                          onChangeText={handleChange("firstName")}
                          onBlur={handleBlur("firstName")}
                          value={values.firstName}
                          style={styles.formInput}
                          placeholder="Gib hier deinen Vornamen ein"
                        />
                      </View>
                      {touched.firstName && errors.firstName ? (
                        <Text style={styles.error}>{errors.firstName}</Text>
                      ) : null}
                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nachname</Text>
                        <TextInput
                          onChangeText={handleChange("lastName")}
                          onBlur={handleBlur("lastName")}
                          value={values.lastName}
                          style={styles.formInput}
                          placeholder="Gib hier deinen Nachnamen ein"
                        />
                      </View>
                      {touched.lastName && errors.lastName ? (
                        <Text style={styles.error}>{errors.lastName}</Text>
                      ) : null}
                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Deine E-Mail-Adresse</Text>
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
                        <Text style={styles.label}>E-Mail bestätigen</Text>
                        <TextInput
                          onChangeText={handleChange("emailConfirmation")}
                          onBlur={handleBlur("emailConfirmation")}
                          value={values.emailConfirmation}
                          style={styles.formInput}
                          placeholder="Bitte bestätige deine Email-Adresse"
                          keyboardType="email-address"
                        />
                      </View>
                      {touched.emailConfirmation && errors.emailConfirmation ? (
                        <Text style={styles.error}>
                          {errors.emailConfirmation}
                        </Text>
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
                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Passwort bestätigen</Text>
                        <TextInput
                          onChangeText={handleChange("passwordConfirmation")}
                          onBlur={handleBlur("passwordConfirmation")}
                          value={values.passwordConfirmation}
                          style={styles.formInput}
                          placeholder="Bitte bestätige dein Passwort"
                          maxLength={18}
                          secureTextEntry={true}
                        />
                      </View>
                      {touched.passwordConfirmation &&
                      errors.passwordConfirmation ? (
                        <Text style={styles.error}>
                          {errors.passwordConfirmation}
                        </Text>
                      ) : null}
                    </View>
                    <View style={styles.altLoginContainer}>
                      <Text style={styles.altLoginText}>
                        Andere Anmeldeoptionen
                      </Text>
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
                        title="Registrieren"
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
  },
  altLoginLogoContainer: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
