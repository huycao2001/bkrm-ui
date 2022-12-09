import axiosClient from "./axiosClient";
const messageApi = {
  // STC
  sendMessage: (store_uuid, branch_uuid, user_uuid, message) => {
    const url = `/stores/${store_uuid}/branches/${branch_uuid}/message`;
    const body = {
      user_uuid: user_uuid,
      message: message
    }
    return axiosClient.post(url, body);
  }
}
export default messageApi;
