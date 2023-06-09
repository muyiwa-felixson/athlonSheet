import axios from 'axios';

const apiKey = process.env.REACT_APP_GOOGLE_API_KEY; // Replace with your API key
const sheetId = process.env.REACT_APP_SHEET_ID; // Replace with your sheet ID
const sheetName = "Members"; // Replace with your sheet name
const apiLayerKey = process.env.REACT_APP_APILAYER_KEY;
const currency = process.env.REACT_APP_CURRENCY;



export const fetchSheetData = async () => {
    try {
      const response = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`
      );

      const data = response.data.values;
      return data;
    } catch (error) {
      console.error("Error fetching data from Google Sheets:", error);
    }
};

export const fetchDomainData = async () => {
    try {
      const response = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Domain?key=${apiKey}`
      );

      const data = response.data.values;
      return data;
    } catch (error) {
      console.error("Error fetching data from Google Sheets:", error);
    }
};

export const fetchRateData = async () => {
  try {
    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Ratecard?key=${apiKey}`
    );

    const data = response.data.values;
    return data;
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error);
  }
};

export const fetchCurrencyConversion = async () => {
  try {
    const response = await axios.get(
      `https://api.apilayer.com/currency_data/live?source=${currency}&currencies=`, {
        headers: {
          apikey: apiLayerKey
        }
      }
    );

    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching data from ApiLayer:", error);
  }
};