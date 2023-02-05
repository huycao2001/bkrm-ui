import axiosClient from "./axiosClient";

const fbTableApi = {
  createTable: (storeUuid, branchUuid, params) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/tables`;
    return axiosClient.post(url, params);
  },
  getTablesOfBranch: (storeUuid, branchUuid, query) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/tables`;
    return axiosClient.get(url, { params: query });
  },
};

export default fbTableApi;
