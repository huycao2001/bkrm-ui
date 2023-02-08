import axiosClient from "./axiosClient";

const fbTableGroupApi = {
  getTableGroupsOfBranch: (storeUuid, branchUuid) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/table_groups`;
    return axiosClient.get(url);
  },

  createTableGroup: (storeUuid, branchUuid, params) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/table_groups`;
    return axiosClient.post(url, params);
  },

  updateTableGroup : (storeUuid, branchUuid, tableGroupUuid, params) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/table_group/${tableGroupUuid}`;
    return axiosClient.put(url, params);
  },
  deleteTableGroup : (storeUuid, branchUuid, tableGroupUuid) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/table_group/${tableGroupUuid}`;
    return axiosClient.delete(url);
  },

};

export default fbTableGroupApi;
