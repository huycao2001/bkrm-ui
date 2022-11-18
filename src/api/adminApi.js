import axiosClient from "./axiosClient";
const adminApi = {
  // STC
  getUsers: () => {
    const url = "/admin/users";
    return axiosClient.get(url);
  },
  toggleAprroveUser: (userUuid) => {
    const url = "/admin/users";
    return axiosClient.get(`${url}/${userUuid}/toggle-approve`);
  }
}
export default adminApi;
