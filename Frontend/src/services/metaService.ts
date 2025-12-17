import axios from '../utils/axios';

export interface Category {
  _id: string;
  name: string;
  description?: string;
}

export interface State {
  name: string;
  code: string;
}

export interface Country {
  _id: string;
  name: string;
  code: string;
  states: State[];
}

// Get all categories
export const getCategories = async () => {
  const response = await axios.get('/meta/categories');
  return response.data;
};

// Get all countries
export const getCountries = async () => {
  const response = await axios.get('/meta/countries');
  return response.data;
};

// Get states by country code
export const getStatesByCountry = async (countryCode: string) => {
  const response = await axios.get(`/meta/countries/${countryCode}/states`);
  return response.data;
};

// Seed categories (for initial setup)
export const seedCategories = async () => {
  const response = await axios.post('/meta/seed/categories');
  return response.data;
};

// Seed countries (for initial setup)
export const seedCountries = async () => {
  const response = await axios.post('/meta/seed/countries');
  return response.data;
};
