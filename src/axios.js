import axios from "axios";

//оболочка axios, чтобы не повторять эту ссылку все время
const instance = axios.create({
  //запросы всегда сюда
  baseURL: "http://localhost:4444/",
});

export default instance;
