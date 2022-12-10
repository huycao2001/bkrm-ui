import axiosClient from "./axiosClient";
const messageApi = {
  // STC
  sendMessage: (store_uuid, branch_uuid, user_uuid, message) => {
    const url = `/stores/${store_uuid}/branches/${branch_uuid}/message`;
    const messageTimestampOptions = {
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    };
    const timestamp = new Date().toLocaleDateString("vi-vn", messageTimestampOptions);
    const body = {
      user_uuid: user_uuid,
      message: message,
      timestamp: timestamp
    }
    return axiosClient.post(url, body);
  }
}
export default messageApi;
