import axiosClient from "./axiosClient";
const adminApi = {
  // STC
  getUsers: (searchKey) => {
    const url = "/admin/users";
    return axiosClient.get(`${url}?searchKey=${searchKey}`);
  },
  toggleAprroveUser: (userUuid) => {
    const url = "/admin/users";
    return axiosClient.post(`${url}/${userUuid}/toggle-approve`);
  }
}
export default adminApi;
