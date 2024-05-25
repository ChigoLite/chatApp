import axios from "axios";
axios.defaults.baseURL = "http://localhost:2020/api/v1";

axios.interceptors.request.use(function (req) {
  const token = localStorage.getItem("user");
  if (token) {
    const { token } = JSON.parse(localStorage.getItem("user"));
    req.headers.authorization = `Bearer ${token}`;
    return req;
  }
  return req;
});
