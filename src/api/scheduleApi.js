import axiosClient from "./axiosClient";

const scheduleApi = {
  createSchedule: (storeUuid, branchUuid, body) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/createSchedule`;
    return axiosClient.post(url, body);
  },

  createShift: (storeUuid, branchUuid, body) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/createShift`;
    return axiosClient.post(url, body);
  },

  getSchedule: (storeUuid, branchUuid, selectedDate, mode) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/getSchedule`;
    return axiosClient.get(url, {
      params: {
        selected_date: selectedDate,
        mode: mode,
      },
    });
  },
  // this is support for assign schedule for employee pop up
  getEmpAndShiftOfBranch: (storeUuid, branchUuid) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/getEmpAndShiftOfBranch`;
    return axiosClient.get(url, {});
  },

  checkAttendance: (storeUuid, branchUuid, schedule) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/checkAttendance`;
    return axiosClient.post(url, { data: schedule });
  },
};
export default scheduleApi;
