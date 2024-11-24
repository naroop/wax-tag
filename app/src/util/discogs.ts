import axios from 'axios';
import { Preferences } from '@capacitor/preferences';

// Create the axios instance
const discogsApi = axios.create({
  baseURL: 'https://api.discogs.com'
});

discogsApi.interceptors.request.use(
  async (config) => {
    const { value: token } = await Preferences.get({ key: 'discogsApiKey' });

    if (token) {
      config.params = config.params || {};
      config.params['token'] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default discogsApi;
