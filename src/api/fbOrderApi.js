import axiosClient from "./axiosClient";

const fbOrderApi = {
  getAllFBOrders: (storeUuid, branchUuid, query) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/fb_orders`;
    return axiosClient.get(url, { params: query });
  },
  createFBOrder: (storeUuid, branchUuid, tableUuid, body) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/tables/${tableUuid}/orders`;
    return axiosClient.post(url, JSON.stringify({ ...body }));
  },
  prepareFBOrder: (storeUuid, branchUuid, fbOrderUuid, body) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/fb_orders/${fbOrderUuid}/prepare`;
    return axiosClient.put(url, JSON.stringify({ ...body }));
  },
  payFBOrder: (storeUuid, branchUuid, fbOrderUuid, body) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/fb_orders/${fbOrderUuid}/pay`;
    return axiosClient.put(url, JSON.stringify({ ...body }));
  },

};

export default fbOrderApi;
