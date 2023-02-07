import axiosClient from "./axiosClient";

const fbTableGroupApi = {
  getTableGroupsOfBranch: (storeUuid, branchUuid) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/table_groups`;
    return axiosClient.get(url);
  },
};

export default fbTableGroupApi;
