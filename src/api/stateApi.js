import axiosClient from "./axiosClient";

const stateApi= {
  updateState: (storeUuid, branchUuid, params) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/states`;
    return axiosClient.put(url, params);
  },

  getState: (storeUuid, branchUuid) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/states`;
    return axiosClient.get(url);
  },



};

export default stateApi;
