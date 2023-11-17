import axios from "axios";

//оболочка axios, чтобы не повторять эту ссылку все время
const instance = axios.create({
  //запросы всегда сюда
  baseURL: "http://localhost:4444/",
});

//при любом запросе проверяем localStorage на авторизацию (токен)
//потому что на бэкенде запросы идут через checkAuth
instance.interceptors.request.use((config) => {
  //в конфиг вшивается графа Authorization
  config.headers.Authorization = window.localStorage.getItem("token");
  return config;
});

export default instance;
