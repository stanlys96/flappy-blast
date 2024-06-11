import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";

export const axiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AXIOS_API,
  headers: {
    Authorization: process.env.NEXT_PUBLIC_STRAPI_TOKEN,
  },
});

export const fetcherStrapi = (url: string) =>
  axiosApi.get(url).then((res) => res);
