import axios from "axios";
import { get } from "firebase/database";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../store/firebase";

const DB_LINK =
  "https://eventify-43747-default-rtdb.europe-west1.firebasedatabase.app/";

export async function fetchUsernameById(uid) {
  const response = await axios.get(DB_LINK + "users.json");

  for (const key in response.data) {
    if (uid === response.data[key].uid) {
      return [response.data[key].firstName, response.data[key].lastName]; // Returns Array
    }
  }
}

export async function fetchUserById(uid) {
  const response = await axios.get(DB_LINK + "users.json");

  for (const key in response.data) {
    if (uid === response.data[key].uid) {
      return response.data[key]; // Returns Object
    }
  }
}
export async function fetchPhotoById(uid) {
  try {
    const response = await axios.get(DB_LINK + "users.json");

    for (const key in response.data) {
      if (uid === response.data[key].uid) {
        return response.data[key].photo; // Returns Object
      }
    }
  } catch (e) {
    console.log(e);
  }
}
export async function updateFirstTimeUserById(uid, firstTimeUserData) {
  try {
    const userList = await axios.get(DB_LINK + "users.json");

    for (const key in userList.data) {
      if (uid === userList.data[key].uid) {
        const response = await axios.put(DB_LINK + "users/" + key + ".json", {
          ...userList.data[key],
          ...firstTimeUserData,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
}
export async function getCreatedEventsById(uid) {
  try {
    const userList = await axios.get(DB_LINK + "users.json");

    let createdEvents = [];

    for (const key in userList.data) {
      if (uid === userList.data[key].uid) {
        createdEvents = [...userList.data[key].createdEvents];
      }
    }
    return createdEvents;
  } catch (error) {
    console.log(error);
  }
}
export async function updateCreatedEventsByUser(uid, createdOn) {
  try {
    let counter = 0;
    const userList = await axios.get(DB_LINK + "users.json");
    for (const key in userList.data) {
      if (uid === userList.data[key].uid) {
        if (typeof userList.data[key].createdEvents === "object") {
          for (const [keyInObject, value] of Object.entries(
            userList.data[key].createdEvents
          )) {
            counter++;
          }
        }
        if (typeof userList.data[key].createdEvents === "Array") {
          userList.data[key].createdEvents.forEach((entry) => {
            counter++;
          });
        }

        // console.log(typeof userList.data[key].createdEvents);
        const response = await axios.put(
          DB_LINK + "users/" + key + "/createdEvents/" + counter + ".json",
          {
            eventId: createdOn,
          }
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export async function updateParticipants(eventId, uid, userName) {
  try {
    const event = await axios.get(DB_LINK + "events/" + eventId + ".json");
    let counter = 0;
    for (const key in event.data.participants) {
      counter++;
    }
    const response = await axios.put(
      DB_LINK + "events/" + eventId + "/participants/" + counter + ".json",
      {
        userID: uid,
        userName: userName,
      }
    );
  } catch (error) {
    console.log(error);
  }
}
export async function fetchParticipatingEvents(uid) {
  try {
    const events = await axios.get(DB_LINK + "events.json");

    let participatingEvents = [];
    for (const key in events.data) {
      if (events.data[key].participants) {
        for (const keyInObject in events.data[key].participants) {
          if (uid === events.data[key].participants[keyInObject].userID) {
            participatingEvents.push(events.data[key]);
          }
        }
      }
    }
    return participatingEvents;
  } catch (error) {
    console.log(error);
  }
}

export async function removeRequester(eventId, uid) {
  try {
    const event = await axios.get(DB_LINK + "events/" + eventId + ".json");
    let counter = 0;

    const filteredData = event.data.entryRequests.filter(
      (entry) => entry != null
    );
    console.log("entry Requests", filteredData);
    for (const key in filteredData) {
      if (filteredData[key].userID === uid) {
        counter = key;
        console.log(counter);
      }
    }
    const response = await axios.put(
      DB_LINK + "events/" + eventId + "/entryRequests/" + counter + ".json",
      {}
    );
  } catch (error) {
    console.log(error);
  }
}
export async function updateParticipationRequest(eventId, uid, userName) {
  try {
    const event = await axios.get(DB_LINK + "events/" + eventId + ".json");
    let counter = 0;
    for (const key in event.data.entryRequests) {
      counter++;
    }
    const response = await axios.put(
      DB_LINK + "events/" + eventId + "/entryRequests/" + counter + ".json",
      {
        userID: uid,
        userName: userName,
      }
    );
  } catch (error) {
    console.log(error);
  }
}

export async function fetchAllEvents() {
  const response = await axios.get(DB_LINK + "events.json");

  const eventsList = [];

  for (const key in response.data) {
    const eventObject = {
      eventId: key,
      createdBy: response.data[key].user,
      title: response.data[key].title,
      date: response.data[key].date,
      time: response.data[key].time,
      category: response.data[key].category,
      coords: response.data[key].mapMarkerCoords,
      location: response.data[key].googleMapsData,
      participants: response.data[key].participants,
      description: response.data[key].description,
      private: response.data[key].private,
      entryRequests: response.data[key].entryRequests,
    };
    eventsList.push(eventObject);
  }
  return eventsList;
}

export async function fetchAllCategories() {
  const response = await axios.get(DB_LINK + "categories.json");

  const categoriesList = [];

  for (const key in response.data) {
    categoriesList.push(response.data[key]);
  }
  // Weird Workaround, because else Firebase fetches Data with index 0, but there is no data at this index?
  let removeFirstIndex = categoriesList.shift();
  return categoriesList;
}
export async function getCreatedEventsInProfile(arrayWithObjects) {
  const response = await axios.get(DB_LINK + "events.json");

  const eventsOfUser = [];
  let relevantEventData = {};
  for (const entry in arrayWithObjects) {
    for (const key in response.data) {
      if (arrayWithObjects[entry].eventId === response.data[key].createdOn) {
        relevantEventData = {
          title: response.data[key].title,
          date: response.data[key].date,
          category: response.data[key].category,
        };
        eventsOfUser.push(relevantEventData);
      }
    }
  }

  return eventsOfUser;
}

export async function uploadImage(
  uri,
  firebasePath,
  id,
  name,
  uploadingStateFunction,
  imageUploadedCheckFunction
) {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new TypeError("Failed to upload image"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
  const imageRef = ref(storage, `${firebasePath}/${id}/${name}.jpg`);
  uploadingStateFunction(true);
  uploadBytes(imageRef, blob)
    .then((snapshot) => {
      uploadingStateFunction(false);
      console.log("Uploaded profile picture!");
      imageUploadedCheckFunction(true);
    })
    .catch((error) => {
      console.log(error);
    });
}
//
//
//
export async function fetchProfilePicture(uid) {
  const profilePicRef = ref(storage, "users/" + uid + "/profilePicture.jpg");
  try {
    const url = await getDownloadURL(profilePicRef);
    return url;
  } catch (error) {
    console.log(error);
  }
}

export async function getPictureById(uid) {
  let url;
  const picRef = ref(database, "users/" + uid + "/photo");
  get(picRef).then((snapshot) => {
    url = snapshot.val();
  });
}
