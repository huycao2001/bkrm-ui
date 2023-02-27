import React, { useState, useEffect, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import { trackPromise } from "react-promise-tracker";
import { useDispatch, useSelector } from "react-redux";
import { Button, Tooltip } from "@material-ui/core";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Paper from "@mui/material/Paper";
import {
  TableBody
} from "@material-ui/core";
import {
  ViewState,
  EditingState,
  GroupingState,
  IntegratedGrouping,
  IntegratedEditing,
} from "@devexpress/dx-react-scheduler";
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
  DateNavigator,
} from "@devexpress/dx-react-scheduler-material-ui";
import { blue, orange } from "@mui/material/colors";

import AddReservation from "./AddReservation/AddReservation";
import fbReservationApi from "../../../api/fbReservationApi";
import LoadingIndicator from "../../../components/LoadingIndicator/LoadingIndicator";
import { statusAction } from "../../../store/slice/statusSlice";
import TableWrapper from "../../../components/TableCommon/TableWrapper/TableWrapper";
import TableHeader from "../../../components/TableCommon/TableHeader/TableHeader";
import * as HeadCells from "../../../assets/constant/tableHead";
import ReservationTableRow from "./ReservationTableRow/ReservationTableRow";
import ToolBar from "../../../components/TableCommon/ToolBar/ToolBar";
import * as TableType from "../../../assets/constant/tableType.js"

const sampleResources = [
  {
    fieldName: "tableId",
    title: "Table",
    instances: [
      { text: "Table 1", id: 1, color: blue },
      // { text: 'Table 2', id: 2, color: orange },
      // { text: 'Table 3', id: 3, color: blue },
      // { text: 'Table 4', id: 4, color: orange },
      // { text: 'Table 5', id: 5, color: blue },
      // { text: 'Table 6', id: 6, color: orange },
      // { text: 'Table 7', id: 7, color: blue },
      // { text: 'Table 8', id: 8, color: orange },
      // { text: 'Table 9', id: 9, color: blue },
      // { text: 'Table 10', id: 10, color: orange },
      // { text: 'Table 11', id: 11, color: blue },
      // { text: 'Table 12', id: 12, color: orange },
      // { text: 'Table 13', id: 13, color: blue },
      // { text: 'Table 14', id: 14, color: orange },
      // { text: 'Table 15', id: 15, color: blue },
      // { text: 'Table 16', id: 16, color: orange },
      // { text: 'Table 17', id: 17, color: blue },
      // { text: 'Table 18', id: 18, color: orange },
      // { text: 'Table 19', id: 19, color: blue },
      // { text: 'Table 20', id: 20, color: orange },
    ],
  },
];
const testData = [
  {
    title: "Website Re-Design Plan",
    tableId: 11,
    startDate: new Date("2023-02-17 9:00:00"),
    // startDate: new Date("2023-02-17 21:00:00"),
    endDate: new Date("2023-02-17 21:00:00"),
    id: 0,
  },
];
const grouping = [
  {
    resourceName: "tableId",
  },
];
Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

const TextEditor = (props) => {
  console.log("mega man");
  console.log(props);
  // eslint-disable-next-line react/destructuring-assignment
  if (props.type === "multilineTextEditor") {
    return null;
  }
  return <AppointmentForm.TextEditor {...props} />;
};

// const DateEditor = (props) => {
//     console.log("mega man x4");
//     console.log(props);
//     // eslint-disable-next-line react/destructuring-assignment
//     // if (props.type === 'multilineTextEditor') {
//     //     return null;
//     // } return <AppointmentForm.TextEditor {...props} />;
//     return <AppointmentForm.DateEditor {...props} onValueChange={nextValue => console.log(nextValue)} />;
//     return null;
// };

const Select = (props) => {
  console.log("megaman 10");
  return null;
  return <AppointmentForm.Select {...props} />;
}
const BooleanEditor = (props) => {
  console.log("mega man x5");
  console.log(props);
  // eslint-disable-next-line react/destructuring-assignment
  // if (props.type === 'multilineTextEditor') {
  //     return null;
  // } return <AppointmentForm.TextEditor {...props} />;
  return null;
};

const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
  console.log("mega man x8");
  console.log(restProps.select);
  const onPhoneChange = (nextValue) => {
    onFieldChange({ phone: nextValue });
  };
  const onNumberOfGuestsChange = (nextValue) => {
    onFieldChange({ number_of_guests: nextValue });
  };
  return (
    <div>
      <AppointmentForm.BasicLayout
        appointmentData={appointmentData}
        onFieldChange={onFieldChange}
        {...restProps}
      >
        <AppointmentForm.Label text="Số điện thoại" type="title" />
        <AppointmentForm.TextEditor
          value={appointmentData.phone}
          onValueChange={onPhoneChange}
          type="numberEditor"
          placeholder="Số điện thoại"
        />
        <AppointmentForm.Label text="Số ghế" type="title" />
        <AppointmentForm.TextEditor
          value={appointmentData.number_of_guests}
          onValueChange={onNumberOfGuestsChange}
          type="numberEditor"
          placeholder="Số ghế"
        />
      </AppointmentForm.BasicLayout>
    </div>
  );
};
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [index, setIndex] = React.useState(0);
  const [pagingState, setPagingState] = useState({
    page: 0,
    limit: 10,
  });
  const [totalRows, setTotalRows] = useState(3);
  const handleChangeIndex = (event, newIndex) => {
    setIndex(newIndex);
  };
  const [resources, setResources] = React.useState([
    {
      fieldName: "tableId",
      title: "Table",
      instances: [
        { text: "Table 1", id: 1, color: blue },
        // { text: 'Table 2', id: 2, color: orange },
        // { text: 'Table 3', id: 3, color: blue },
        // { text: 'Table 4', id: 4, color: orange },
        // { text: 'Table 5', id: 5, color: blue },
        // { text: 'Table 6', id: 6, color: orange },
        // { text: 'Table 7', id: 7, color: blue },
        // { text: 'Table 8', id: 8, color: orange },
        // { text: 'Table 9', id: 9, color: blue },
        // { text: 'Table 10', id: 10, color: orange },
        // { text: 'Table 11', id: 11, color: blue },
        // { text: 'Table 12', id: 12, color: orange },
        // { text: 'Table 13', id: 13, color: blue },
        // { text: 'Table 14', id: 14, color: orange },
        // { text: 'Table 15', id: 15, color: blue },
        // { text: 'Table 16', id: 16, color: orange },
        // { text: 'Table 17', id: 17, color: blue },
        // { text: 'Table 18', id: 18, color: orange },
        // { text: 'Table 19', id: 19, color: blue },
        // { text: 'Table 20', id: 20, color: orange },
      ],
    },
  ]);
  const [reservationList, setReservationList] = useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const handleRequestSort = (event, property) => {
    //// (gửi order vs orderBy lên api) -> fetch lại data để sort
    // const isAsc = orderBy === property && order === 'asc';
    // setOrder(isAsc ? 'desc' : 'asc');
    // setOrderBy(property);
  };
  const [data, setData] = React.useState(testData);
  const onCommitChanges = React.useCallback(
    ({ added, changed, deleted }) => {
      console.log("HEY HEY");
      console.log(changed);
      if (added) {
        const startingAddedId =
          data.length > 0 ? data[data.length - 1].id + 1 : 0;
        setData([...data, { id: startingAddedId, ...added }]);
      }
      if (changed) {
        setData(
          data.map((appointment) =>
            changed[appointment.id]
              ? { ...appointment, ...changed[appointment.id] }
              : appointment
          )
        );
        data.map((appointment) =>
          changed[appointment.id]
            ? (console.log("light theme"),
              console.log(changed),
              updateReservation(
                {
                  name: changed[appointment.id].title
                    ? changed[appointment.id].title
                    : appointment.title,
                  phone: changed[appointment.id].phone
                    ? changed[appointment.id].phone
                    : appointment.phone,
                  reservation_datetime: changed[appointment.id].startDate
                    ? new Date(
                      changed[appointment.id].startDate -
                      new Date().getTimezoneOffset() * 60000
                    )
                      .toISOString()
                      .slice(0, 19)
                      .replace("T", " ")
                    : appointment.startDate,
                  reservation_duration:
                    ((changed[appointment.id].endDate
                      ? changed[appointment.id].endDate
                      : appointment.endDate) -
                      (changed[appointment.id].startDate
                        ? changed[appointment.id].startDate
                        : appointment.startDate)) /
                    1000 /
                    60 /
                    60,
                  number_of_guests: changed[appointment.id].number_of_guests
                    ? changed[appointment.id].number_of_guests
                    : appointment.number_of_guests,
                  table_uuid: appointment.table_uuid,
                },
                appointment.reservation_uuid
              ))
            : // console.log(((changed[appointment.id].endDate ? changed[appointment.id].endDate : appointment.endDate) - (changed[appointment.id].startDate ? changed[appointment.id].startDate : appointment.startDate)) / 1000 / 60 / 60)
            // console.log(JSON.stringify(changed[appointment.id].startDate).slice(1, 20).replace('T', ' ')), console.log("HELLO")
            // console.log((new Date(changed[appointment.id].startDate - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, 19).replace('T', ' '))
            void 0
        );
      }
      if (deleted !== undefined) {
        console.log("erased");
        setData(data.filter((appointment) => appointment.id !== deleted));
        data.map((appointment) => {
          appointment.id === deleted ? deleteReservation(appointment.reservation_uuid) : void (0);
        });

      }
      console.log(data);
    },
    [setData, data]
  );
  const [openAddReservationDialog, setOpenAddReservationDialog] =
    useState(false);
  const handleCloseAddReservationDialog = () => {
    setOpenAddReservationDialog(false);
  };
  const handleOpenAddReservationDialog = () => {
    setOpenAddReservationDialog(true);
  };
  const [reload, setReload] = useState(true);
  const [reloadTableGroupEditor, setReloadTableGroupEditor] = useState(false);
  const infoDetail = useSelector((state) => state.info);
  const store_uuid = infoDetail.store.uuid;
  const branch_uuid = infoDetail.branch.uuid;

  const [currentDate, setCurrentDate] = useState(() => {
    const utcDate = new Date();
    const ictDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
    const mysqlDateTime = ictDate.toISOString().slice(0, 19).replace("T", " ");
    return mysqlDateTime.slice(0, 11);
  });
  useEffect(() => {
    const loadReservationsWithTime = async () => {
      try {
        const response = await trackPromise(
          fbReservationApi.getReservations(store_uuid, branch_uuid, {
            currentDate,
          })
        );
        // setReservationList(response.data.reservations);
        // console.log("this is wat I l00k1ng for");
        console.log(response.data.reservations);

        // console.log(response.data);
        // console.log("this is reservation list: ");
        if (response.data.reservations.length > 0) {
          setData(
            response.data.reservations.map(function (item) {
              return {
                title: item.name,
                tableId: item.table.id,
                startDate: new Date(item.reservation_datetime),
                endDate: new Date(item.reservation_endtime),
                id: item.id,
                phone: item.phone,
                number_of_guests: item.number_of_guests,
                reservation_uuid: item.uuid,
                table_uuid: item.table.uuid,
              };
            })
          );
          setResources([
            {
              fieldName: "tableId",
              title: "Table",
              instances: response.data.tables.map(function (item) {
                return {
                  text: item.name,
                  id: item.id,
                  color: blue,
                  uuid: item.uuid,
                };
              }),
            },
          ]);
        } else {
          console.log("there is no reservations");
          setResources(sampleResources);
          setData(testData);
        }
      } catch (error) {
        console.log(error);
        console.log("FAILED");
      }
    };
    if (store_uuid && branch_uuid) {
      loadReservationsWithTime();
    }
  }, [branch_uuid, reload, currentDate]);

  useEffect(() => {
    const loadAllReservations = async () => {
      try {
        const response = await trackPromise(
          fbReservationApi.getReservations(store_uuid, branch_uuid, {
          })
        );
        setReservationList(response.data.reservations);
        console.log("this is wat I l00k1ng for");
        console.log(response.data.reservations);

        // console.log(response.data);
        // console.log("this is reservation list: ");
      } catch (error) {
        console.log(error);
        console.log("FAILED");
      }
    };
    if (store_uuid && branch_uuid) {
      loadAllReservations();
    }
  }, [branch_uuid, reload]);

  const updateReservation = async (newReservation, reservation_uuid) => {
    try {
      const response = await trackPromise(
        fbReservationApi.updateReservation(
          store_uuid,
          branch_uuid,
          reservation_uuid,
          newReservation
        )
      );
      if (response.message === "Success") {
        console.log("YAY I DID IT");
        dispatch(statusAction.successfulStatus("Cập nhật thành công"));
      } else {
        console.log("WAT DA FUCH");
        dispatch(statusAction.failedStatus("Cập nhật thất bại"));
      }
    } catch (error) {
      console.log(error);
      console.log("FAILED");
      dispatch(statusAction.failedStatus("Cập nhật thất bại"));
    }
  };

  const deleteReservation = async (reservation_uuid) => {
    try {
      const response = await trackPromise(
        fbReservationApi.deleteReservation(
          store_uuid,
          branch_uuid,
          reservation_uuid,
        )
      );
      if (response.message === "Success") {
        dispatch(statusAction.successfulStatus("Xóa thành công"));
      } else {
        dispatch(statusAction.failedStatus("Xóa thất bại"));
      }
    } catch (error) {
      dispatch(statusAction.failedStatus("Xóa thất bại"));
    }
  };
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={index}
          onChange={handleChangeIndex}
          aria-label="simple tabs example"
        >
          <Tab label="Theo lịch" {...a11yProps(0)} />
          <Tab label="Theo danh sách" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={index} index={0}>
        <LoadingIndicator></LoadingIndicator>
        <Tooltip title="Thêm bàn mới">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAddReservationDialog}
          >
            Thêm
          </Button>
        </Tooltip>
        {openAddReservationDialog && (
          <AddReservation
            openAddReservationDialog={openAddReservationDialog}
            handleCloseAddReservationDialog={handleCloseAddReservationDialog}
            setReload={() => setReload(!reload)}
            reloadTableGroupEditor={reloadTableGroupEditor}
            setReloadTableGroupEditor={setReloadTableGroupEditor}
          />
        )}
        <Scheduler data={data} height={660}>
          <ViewState
            onCurrentDateChange={(e) => {
              const utcDate = new Date(e);
              const ictDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
              const mysqlDateTime = ictDate
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");
              setCurrentDate(mysqlDateTime.slice(0, 11));
            }}
          />
          <EditingState
            // onCommitChanges={(e) => {
            //     console.log("HEY HEY");
            //     console.log(e);
            // }}
            onCommitChanges={onCommitChanges}
          />
          <GroupingState grouping={grouping} />
          <DayView />
          <WeekView />
          <MonthView />
          <Appointments />
          <Resources data={resources} mainResourceName="tableId" />

          <IntegratedGrouping />
          <IntegratedEditing />
          <AppointmentTooltip />
          <AppointmentForm
            basicLayoutComponent={BasicLayout}
            textEditorComponent={TextEditor}
            // dateEditorComponent={DateEditor}
            booleanEditorComponent={BooleanEditor}
            selectComponent={Select}
          />

          <GroupingPanel />

          <Toolbar />
          <DateNavigator />
          <ViewSwitcher />
          <DragDropProvider />
          <CurrentTimeIndicator
          //   shadePreviousCells={shadePreviousCells}
          //   shadePreviousAppointments={shadePreviousAppointments}
          //   updateInterval={updateInterval}
          />
        </Scheduler>
      </TabPanel>
      <TabPanel value={index} index={1}>
        {/* <ToolBar
          dataTable={tableList}
          tableType={TableType.FBTable}
          textSearch={"#, Tên bàn... "}
          isOnlySearch={false}
          searchKey={query.searchKey} setSearchKey={(value) => setQuery({ ...query, searchKey: value })}
          orderByOptions={
            [
              { value: 'tables.created_at', label: "Ngày tạo" },
              { value: 'tables.name', label: "Tên bàn" },
              { value: 'tables.seats', label: "Số ghế" },
              { value: 'table_groups.name', label: 'Tên nhóm bàn' }
            ]
          }
          orderBy={query.orderBy}
          setOrderBy={(value) => setQuery({ ...query, orderBy: value })}
          sort={query.sort}
          setSort={(value) => setQuery({ ...query, sort: value })}
          tableGroup={query.tableGroup}
          tableGroupOptions={tableGroupList}

          setTableGroup={(value) => setQuery({ ...query, tableGroup: value })}
          handleRemoveFilter={() => setQuery(initQuery)}

        /> */}
        <TableWrapper
          pagingState={{ ...pagingState, total_rows: totalRows }}
          setPagingState={setPagingState}
          list={reservationList}
          tableRef={null}
        >
          <TableHeader
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            headerData={HeadCells.ReservationHeadCells}
          />
          <TableBody>
            {reservationList.map((row, index) => {
              return (
                <ReservationTableRow
                  key={row.uuid}
                  row={row}
                  setReload={() => setReload(!reload)}
                  // openRow={openRow}
                  // handleOpenRow={handleOpenRow}
                  isManageInventory={false}
                  handleSetReloadTableGroupEditor={() => setReloadTableGroupEditor(!reloadTableGroupEditor)}
                />
              );
            })}
          </TableBody>
        </TableWrapper>
      </TabPanel>
    </div>
  );
};
