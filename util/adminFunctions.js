import { onValue, ref, set } from "firebase/database";
import { database } from "../store/firebase";

export function getCurrentUser(uid) {
  const usersFromDatabase = ref(database, "users/");
  onValue(usersFromDatabase, (snapshot) => {
    const data = snapshot.val();
    // console.log(Object.entries(data)[0][0]);
    for (const key in Object.entries(data)) {
      if (Object.entries(data)[key][1].uid === uid) {
        console.log(Object.entries(data)[key][1]);
      }
    }
  });
}

export function getAllUsers() {
  const usersFromDatabase = ref(database, "users/");
  let dataOutput;
  onValue(usersFromDatabase, (snapshot) => {
    const data = snapshot.val();
    dataOutput = Object.entries(data);
  });
  return dataOutput;
}

export function changeAdminStatus(key, status) {
  set(ref(database, "users/" + key), {
    isAdmin: status,
  });
}

export function deleteUser(key) {
  set(ref(database, "users/" + key), null);
}
export function checkBanStatus(uid) {
  const bannedUsers = ref(database, "bannedUsers/" + uid);
  let status;
  onValue(bannedUsers, (snapshot) => {
    const data = snapshot.val();
    status = data;
  });
  return status;
}

export function banUser(uid) {
  set(ref(database, "bannedUsers/" + uid), true);
}
export function unbanUser(uid) {
  set(ref(database, "bannedUsers/" + uid), null);
}
