import axiosClient from "./axiosClient";

const fbReservationApi = {
    getReservations: (storeUuid, branchUuid, query) => {
        const url = `public/stores/${storeUuid}/branches/${branchUuid}/reservations`;
        return axiosClient.get(url, { params: query });
    },
};

export default fbReservationApi;
