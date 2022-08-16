import { createContext, useState } from "react";

export const AuthContext = createContext({
  // Everything here is just for autocompletion! Nothing inside here is actual logic!!!!
  user: {
    uid: "",
    firstName: "",
    lastName: "",
    email: "",
    emailVerified: false,
    apiKey: "",
  },
  isSignedIn: false,
  createUser: () => {},
  logOut: () => {},
  signInUser: () => {},
  adminStatus: false,
  setAdminStatus: () => {},
});

export default function AuthContextProvider({ children }) {
  // Defining the actual data and logic
  const [user, setUser] = useState({
    uid: "",
    firstName: "",
    lastName: "",
    email: "",
    emailVerified: false,
    firebaseData: {},
  });
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [adminStatus, setAdminStatus] = useState(false);
  function signInUser(bool) {
    setIsSignedIn(bool);
  }
  function createUser(
    uid,
    firstName,
    lastName,
    email,
    emailVerified,
    firebaseData
  ) {
    setUser({ uid, firstName, lastName, email, emailVerified, firebaseData });
    setIsSignedIn(true);
  }
  function logOut() {
    setIsSignedIn(false);
    setAdminStatus(false);
  }
  function setAdmin() {
    setAdminStatus(true);
  }
  // All global Variables to pass to the state
  const value = {
    user: user,
    isSignedIn: isSignedIn,
    signInUser: signInUser,
    createUser: createUser,
    logOut: logOut,
    adminStatus: adminStatus,
    setAdmin: setAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
