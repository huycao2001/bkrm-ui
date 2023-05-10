import axiosClient from "./axiosClient";

const metabaseApi = {
  createMetabaseProfile: () => {
    const url = `/metabase/create-profile`;
    return axiosClient.post(url);
  },


  syncMetabaseData: () => {
    const url = `/metabase/sync-data`;
    return axiosClient.post(url);
  },

};
export default metabaseApi;
