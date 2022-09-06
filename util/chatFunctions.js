import {
  child,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  set,
  update,
} from "firebase/database";
import { database } from "../store/firebase";

// Function that gets the database key of an event with the createdOn value
export function getEventKey(createdOn) {
  console.log("getEventKey createdOn", createdOn);
  const eventsFromDatabase = ref(database, "events/");
  let dataOutput;
  onValue(eventsFromDatabase, (snapshot) => {
    const data = snapshot.val();
    console.log(snapshot.exists());
    console.log(snapshot.val());
    dataOutput = Object.entries(data);
  });
  console.log(dataOutput);
  console.log(
    "getEventKey dataOutput",
    dataOutput.find((entry) => entry[1].createdOn === createdOn)[0]
  );
  return dataOutput.find((entry) => entry[1].createdOn === createdOn)[0];
}

export function getChat(eventId) {
  console.log("eventId in getChat: ", eventId);
  const chat = query(
    ref(database, "chats/" + eventId),
    orderByChild("createdAt")
  );
  let dataOutput;
  let dataX;
  onValue(chat, (snapshot) => {
    if (snapshot.val() !== null) {
      dataX = snapshot.val();
    } else {
      dataX = [];
    }
    dataOutput = Object.values(dataX);
  });
  return dataOutput;
}

export function addToChat(eventId, message) {
  const chat = ref(database, "chats/" + eventId);

  // get a new key
  const newKey = push(child(ref(database), "chats" + eventId)).key;

  update(ref(database, "chats/" + eventId + "/" + newKey), message);
}
