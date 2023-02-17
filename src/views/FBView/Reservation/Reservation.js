import React, { useState, useEffect, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import { trackPromise } from "react-promise-tracker";
import { useDispatch, useSelector } from "react-redux";
import { Button, Tooltip } from '@material-ui/core';
import Paper from '@mui/material/Paper';
import {
    ViewState, EditingState, GroupingState, IntegratedGrouping, IntegratedEditing,
} from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    Resources,
    DayView,
    WeekView,
    MonthView,
    Appointments,
    AppointmentTooltip,
    AppointmentForm,
    GroupingPanel,
    Toolbar,
    ViewSwitcher,
    DragDropProvider,
    CurrentTimeIndicator,
} from '@devexpress/dx-react-scheduler-material-ui';
import { blue, orange } from '@mui/material/colors';

import { data as appointments } from './demo-data/grouping';

import AddReservation from "./AddReservation/AddReservation";
import fbReservationApi from "../../../api/fbReservationApi";
const resources = [{
    fieldName: 'tableId',
    title: 'Table',
    instances: [
        { text: 'Table 1', id: 1, color: blue },
        { text: 'Table 2', id: 2, color: orange },
        { text: 'Table 3', id: 3, color: blue },
        { text: 'Table 4', id: 4, color: orange },
        { text: 'Table 5', id: 5, color: blue },
        { text: 'Table 6', id: 6, color: orange },
        { text: 'Table 7', id: 7, color: blue },
        { text: 'Table 8', id: 8, color: orange },
        { text: 'Table 9', id: 9, color: blue },
        { text: 'Table 10', id: 10, color: orange },
        { text: 'Table 11', id: 11, color: blue },
        { text: 'Table 12', id: 12, color: orange },
        { text: 'Table 13', id: 13, color: blue },
        { text: 'Table 14', id: 14, color: orange },
        { text: 'Table 15', id: 15, color: blue },
        { text: 'Table 16', id: 16, color: orange },
        { text: 'Table 17', id: 17, color: blue },
        { text: 'Table 18', id: 18, color: orange },
        { text: 'Table 19', id: 19, color: blue },
        { text: 'Table 20', id: 20, color: orange },
    ],
}];
const grouping = [{
    resourceName: 'tableId',
}];
Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

export default () => {

    // const [reservationList, setReservationList] = useState([]);
    const testData = [{
        title: 'Website Re-Design Plan',
        tableId: 11,
        startDate: new Date("2023-02-17 21:00:00"),
        // startDate: new Date("2023-02-17 21:00:00"),
        endDate: new Date("2023-02-17 21:00:00"),
        id: 0,
    }]

    const [data, setData] = React.useState(testData);
    const onCommitChanges = React.useCallback(({ added, changed, deleted }) => {
        if (added) {
            const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
            setData([...data, { id: startingAddedId, ...added }]);
        }
        if (changed) {
            setData(data.map(appointment => (
                changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment)));
        }
        if (deleted !== undefined) {
            setData(data.filter(appointment => appointment.id !== deleted));
        }
    }, [setData, data]);
    const [openAddTableDialog, setOpenAddTableDialog] = useState(false);
    const handleCloseAddTableDialog = () => {
        setOpenAddTableDialog(false);
    };
    const handleOpenAddTableDialog = () => {
        setOpenAddTableDialog(true);
    };
    const [reload, setReload] = useState(true);
    const [reloadTableGroupEditor, setReloadTableGroupEditor] = useState(false);
    const infoDetail = useSelector((state) => state.info);
    const store_uuid = infoDetail.store.uuid;
    const branch_uuid = infoDetail.branch.uuid;

    useEffect(() => {
        const loadReservations = async () => {
            try {
                const response = await trackPromise(
                    fbReservationApi.getReservations(
                        store_uuid,
                        branch_uuid,
                        {
                            //   ...query,
                            //   ...pagingState
                        }
                    )
                );
                // setReservationList(response.data.reservations);
                console.log("zzzzzzzz");
                console.log(response.data.reservations);
                console.log("this is reservation list: ");
                // console.log(reservationList);
                var allReservations = response.data.reservations.map(function (item) {
                    return {
                        title: item.name,
                        tableId: item.table.id,
                        startDate: new Date(item.reservation_datetime),
                        // startDate: new Date("2023-02-17 21:00:00"),
                        endDate: new Date(item.reservation_endtime),
                        id: item.id,
                    };
                });
                // console.log("KOKO");
                // console.log(allReservations);
                // console.log(appointments);
                setData(allReservations);
            } catch (error) {
                console.log(error);
                console.log("FAILED");
            }
        };
        if (store_uuid && branch_uuid) {
            loadReservations();
        }
    }, [branch_uuid, reload]);


    return (
        <Paper>
            <Tooltip title="Thêm bàn mới">
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddTableDialog}
                >
                    Thêm
                </Button>
            </Tooltip>
            {openAddTableDialog && (
                <AddReservation
                    openAddTableDialog={openAddTableDialog}
                    handleCloseAddTableDialog={handleCloseAddTableDialog}
                    setReload={() => setReload(!reload)}
                    reloadTableGroupEditor={reloadTableGroupEditor}
                    setReloadTableGroupEditor={setReloadTableGroupEditor}
                />
            )}
            <Scheduler
                data={data}
                height={660}
            >
                <ViewState
                />
                <EditingState
                    onCommitChanges={onCommitChanges}
                />
                <GroupingState
                    grouping={grouping}
                />
                <DayView
                />
                <WeekView
                />
                <MonthView />
                <Appointments />
                <Resources
                    data={resources}
                    mainResourceName="tableId"
                />

                <IntegratedGrouping />
                <IntegratedEditing />
                <AppointmentTooltip />
                <AppointmentForm />

                <GroupingPanel />

                <Toolbar />
                <ViewSwitcher />
                <DragDropProvider />
                <CurrentTimeIndicator
                //   shadePreviousCells={shadePreviousCells}
                //   shadePreviousAppointments={shadePreviousAppointments}
                //   updateInterval={updateInterval}
                />
            </Scheduler>

        </Paper>
    );
};
