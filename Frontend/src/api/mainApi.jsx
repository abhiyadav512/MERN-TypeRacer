import axios from "axios";

const mainApi = axios.create({
  baseUrl: import.meta.env.VITE_APP_API_URL,
});

export default mainApi;
