import axios from 'axios';

const API_URL = 'https://api.openchargemap.io/v3/poi/';
const API_KEY = '49733b67-b3f1-498f-99f4-bfb4364cc14c';

export const getChargingStations = async (latitude, longitude, distance = 10, maxresults = 14) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        output: 'json',
        latitude,
        longitude,
        distance,
        maxresults,
        key: API_KEY,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Erreur API Open Charge Map:", err);
    return [];
  }
};
