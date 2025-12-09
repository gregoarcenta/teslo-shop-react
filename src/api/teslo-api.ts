import axios from "axios";

const tesloApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

//todo: configurar interceptores

export { tesloApi };
