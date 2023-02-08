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
  updateTable : (storeUuid, branchUuid, tableUuid,params) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/tables/${tableUuid}`;
    return axiosClient.put(url, params);
  },
  deleteTable : (storeUuid, branchUuid, tableUuid) =>{
    const url = `stores/${storeUuid}/branches/${branchUuid}/tables/${tableUuid}`;
    return axiosClient.delete(url);

  }

};

export default fbTableApi;
