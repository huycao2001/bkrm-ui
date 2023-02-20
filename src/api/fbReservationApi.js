import axiosClient from "./axiosClient";

const fbReservationApi = {
    createReservation: (storeUuid, branchUuid, params, table_id) => {
        const url = `public/stores/${storeUuid}/branches/${branchUuid}/tables/${table_id}/reserve`;
        return axiosClient.put(url, params);
    },
    getReservations: (storeUuid, branchUuid, query) => {
        const url = `public/stores/${storeUuid}/branches/${branchUuid}/reservations`;
        return axiosClient.get(url, { params: query });
    },
    deleteReservation: (storeUuid, branchUuid, reservationUuid) => {
        const url = `public/stores/${storeUuid}/branches/${branchUuid}/reservations/${reservationUuid}`;
        return axiosClient.delete(url);
    }
};

export default fbReservationApi;
