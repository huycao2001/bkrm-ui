import axiosClient from "./axiosClient";

const fbTableApi = {
  createTable: (storeUuid, branchUuid, params) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/tables`;
    return axiosClient.post(url, params);
  },
};

export default fbTableApi;
