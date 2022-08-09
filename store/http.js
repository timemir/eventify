import axios from "axios";

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
