import React, { useDebugValue } from "react";
import { useStyles } from "./style";
import { useState } from "react";
import {
  useTheme,
  makeStyles,
  createStyles,
  withStyles,
} from "@material-ui/core/styles";
import {
  Typography,
  Divider,
  Badge,
  Dialog,
  IconButton,
  FormControlLabel,
  Grid,
  Switch,
  Popover,
  Paper,
  Box,
  TextField,
  Avatar,
  ButtonBase,
  InputAdornment,
  ButtonGroup,
  Button,
  Tooltip,
  TableContainer,
} from "@material-ui/core";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import EmployeeItemAva from "./EmployeeItem/EmployeeItemAva";
import Card from "@material-ui/core/Card";
import { grey } from "@material-ui/core/colors";

import AddIcon from "@material-ui/icons/Add";
import "date-fns";

import { formatDate, getMonday, calNextDay } from "./dateUtil";
import ScheduleHead from "./ScheduleHead/ScheduleHead";
import ScheduleToolBar from "./ScheduleToolBar/ScheduleToolBar";
import { HeadWeek, ShiftWeekBox } from "./ScheduleView/WeekView/WeekView";
import { HeadDay, ShiftDayBox } from "./ScheduleView/DayView/DayView";
import { HeadMonth, ShiftMonthBox } from "./ScheduleView/MonthView/MonthView";
import scheduleApi from "../../../api/scheduleApi";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import AddShiftPopup from "./AddShiftPopup/AddShiftPopup";
import AddSchedulePopup from "./AddSchedulePopup/AddSchedulePopup";
import ScheduleDetail from "./ScheduleDetail/ScheduleDetail";
import { statusAction } from "../../../store/slice/statusSlice";
const Schedule = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [addShiftOpen, setAddShiftOpen] = React.useState(false);
  const [addScheduleOpen, setAddScheduleOpen] = React.useState(false);
  const [reload, setReload] = React.useState(false);

  // A. LOAD DATA from api
  // shiftInfo,schedule,...
  // load here ...........
  const [shiftInfo, setShiftInfo] = React.useState([]);
  // B. Xu ly sate
  //// 1. Tool bar
  // 1.1 choose branch

  // 1.2. Search employee

  //// 2. Schedule bar
  // 2.1 chosse date
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = (dayStr) => {
    setSelectedDate(dayStr);
    setAnchorEl(null);
  };

  // 2.2 choose mode day-week-month
  const [selectedBtn, setSelectedBtn] = React.useState(1);

  // api to get schedule
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;

  React.useEffect(() => {
    let selected_date = moment
      .unix(selectedDate.getTime() / 1000)
      .format("YYYY-MM-DD", { trim: false });
    let mode = "";
    switch (selectedBtn) {
      case 0:
        mode = "day";
        break;
      case 1:
        mode = "week";
        break;
      case 2:
        mode = "month";
        break;
    }

    const fetchSchedule = async () => {
      try {
        const response = await scheduleApi.getSchedule(
          store_uuid,
          branch_uuid,
          selected_date,
          mode
        );
        setShiftInfo(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSchedule();
  }, [selectedBtn, selectedDate, branch_uuid, reload]);

  const handleModeBtn = (mode) => {
    setSelectedBtn(mode);

    // re-load data
    // cai nay để tạm thôi
    // if (mode === 0){
    //     setShiftInfo(shiftInfoWeek) //Day
    // }else if (mode === 1){
    //     setShiftInfo(shiftInfoWeek) //Week
    // }else{
    //     setShiftInfo(shiftInfoMonth) //Week
    // }
  };

  // 2.3 onClickSchedule (shift- day)
  const [clickSchedule, setClickSchedule] = React.useState({});
  //popUpDetail
  const [open, setOpen] = React.useState(false);
  const handlePopUp = () => {
    setOpen(!open);
  };

  ////
  //mode
  const [mode, setMode] = React.useState(true);
  const handleChangeMode = (event) => {
    setMode(event.target.checked);
  };
  const [modeMonth, setModeMonth] = React.useState(true);
  const handleChangeModeMonth = (event) => {
    setModeMonth(event.target.checked);
  };
  const dispatch = useDispatch();

  const handleSubmitSchedule = async (schedules) => {
    try {
      const response = await scheduleApi.checkAttendance(
        store_uuid,
        branch_uuid,
        schedules
      );

      dispatch(statusAction.successfulStatus("Chấm công thành công"));
      setReload(!reload);
      setOpen(false);
    } catch (err) {
      console.log(err);
      dispatch(statusAction.failedStatus("Chấm công thất bại"));
    }
  };

  return (
    <Card className={classes.root}>
      {/* 1. search + choose branch */}
      <ScheduleHead />

      {addShiftOpen && (
        <AddShiftPopup
          addShiftOpen={addShiftOpen}
          handleClose={() => setAddShiftOpen(false)}
          reload={() => setReload(!reload)}
        />
      )}
      {addScheduleOpen && (
        <AddSchedulePopup
          addScheduleOpen={addScheduleOpen}
          handleClose={() => setAddScheduleOpen(false)}
          reload={() => setReload(!reload)}
        />
      )}

      <Divider className={classes.divider} />

      {/* 2. choose mode + choose date + add schedule */}
      <ScheduleToolBar
        openAddSchedule={() => setAddScheduleOpen(true)}
        selectedBtn={selectedBtn}
        handleModeBtn={handleModeBtn}
        setSelectedBtn={setSelectedBtn}
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
      />
      {(() => {
        switch (selectedBtn) {
          case 0:
            return (
              <>
                <HeadDay
                  selectedDate={selectedDate}
                  openAddShift={() => setAddShiftOpen(true)}
                />
                {shiftInfo.map((shift) => {
                  return (
                    // !!!! shift with schedultList have only Select Date
                    <ShiftDayBox
                      selectedDate={selectedDate}
                      shift={shift}
                      handlePopUp={handlePopUp}
                      setClickSchedule={setClickSchedule}
                      mode={mode}
                    />
                  );
                })}
                <FormControlLabel
                  control={
                    <Switch checked={mode} onChange={handleChangeMode} />
                  }
                  className={classes.mode}
                />
              </>
            );
          case 1: //WEEK VIEW
            return (
              <>
                <TableContainer>
                  <HeadWeek
                    selectedDate={selectedDate}
                    openAddShift={() => setAddShiftOpen(true)}
                  />
                  {shiftInfo.map((shift) => {
                    return (
                      <ShiftWeekBox
                        selectedDate={selectedDate}
                        shift={shift}
                        handlePopUp={handlePopUp}
                        setClickSchedule={setClickSchedule}
                        mode={mode}
                      />
                    );
                  })}
                </TableContainer>

                <FormControlLabel
                  control={
                    <Switch checked={mode} onChange={handleChangeMode} />
                  }
                  className={classes.mode}
                />
              </>
            );
          case 2:
            return (
              <>
                <TableContainer>
                  <HeadMonth
                    selectedDate={selectedDate}
                    openAddShift={() => setAddShiftOpen(true)}
                  />
                  {shiftInfo.map((shift) => {
                    return (
                      <ShiftMonthBox
                        selectedDate={selectedDate}
                        shift={shift}
                        modeMonth={modeMonth}
                      />
                    );
                  })}
                </TableContainer>
                <FormControlLabel
                  control={
                    <Switch
                      checked={modeMonth}
                      onChange={handleChangeModeMonth}
                    />
                  }
                  className={classes.mode}
                />
              </>
            );
        }
      })()}

      <ScheduleDetail
        open={open}
        handlePopUp={handlePopUp}
        clickSchedule={clickSchedule}
        handleSubmit={handleSubmitSchedule}
      />
      {/* Con pop up check attendance cho employee cu the */}
    </Card>
  );
};

export default Schedule;

const shiftInfoWeek = [
  {
    id: 1,
    name: "Ca sáng",
    fromTime: "07:00",
    toTime: "12:00",
    scheduleList: [
      // Moi employee chỉ 1 hàng trong 1 ngày -> cái này copy paste nên còn sai
      // them employeeInfo(employeeId , employeeRole, employyePhone,...),cheduleID,...
      { employeeId: 1, name: "Gia Le", date: "29/11/2021", status: 1 },
      { employeeId: 2, name: "Quoc Hai", date: "29/11/2021", status: -1 },
      {
        employeeId: 3,
        name: "Mai Truong Khang",
        date: "29/11/2021",
        status: 0,
      },
      {
        employeeId: 4,
        name: "Mai Huynh Tuan Kiet",
        date: "29/11/2021",
        status: 1,
      },
      { employeeId: 5, name: "Minh Tri", date: "29/11/2021", status: 1 },
      { employeeId: 6, name: "Quoc Hai", date: "29/11/2021", status: 0 },
      { employeeId: 6, name: "Gia Le", date: "29/11/2021", status: -1 },
      { employeeId: 6, name: "Minh Tri", date: "29/11/2021", status: 0 },

      { employeeId: 1, name: "Gia Le", date: "30/11/2021", status: 1 },
      { employeeId: 5, name: "Minh Tri", date: "30/11/2021", status: 1 },
      { employeeId: 2, name: "Quoc Hai", date: "30/11/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "30/11/2021", status: 0 },
      { employeeId: 5, name: "Minh Tri", date: "30/11/2021", status: 1 },
      { employeeId: 2, name: "Quoc Hai", date: "30/11/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "30/11/2021", status: -1 },
      { employeeId: 5, name: "Minh Tri", date: "30/11/2021", status: -1 },
      { employeeId: 2, name: "Quoc Hai", date: "30/11/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "30/11/2021", status: -1 },
      { employeeId: 5, name: "Minh Tri", date: "30/11/2021", status: -1 },

      { employeeId: 1, name: "Gia Le", date: "01/12/2021", status: 1 },
      { employeeId: 5, name: "Minh Tri", date: "01/12/2021", status: 1 },
      { employeeId: 2, name: "Quoc Hai", date: "01/12/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "01/12/2021", status: 1 },
      { employeeId: 5, name: "Minh Tri", date: "01/12/2021", status: 1 },
      { employeeId: 2, name: "Quoc Hai", date: "01/12/2021", status: -1 },
      { employeeId: 1, name: "Gia Le", date: "01/12/2021", status: 1 },
      { employeeId: 5, name: "Minh Tri", date: "01/12/2021", status: 0 },

      { employeeId: 1, name: "Gia Le", date: "02/12/2021", status: -1 },
      { employeeId: 5, name: "Minh Tri", date: "02/12/2021", status: -1 },
      { employeeId: 2, name: "Quoc Hai", date: "02/12/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "02/12/2021", status: 0 },
      { employeeId: 2, name: "Quoc Hai", date: "02/12/2021", status: 1 },
      { employeeId: 1, name: "Gia Le", date: "02/12/2021", status: -1 },
      { employeeId: 1, name: "Gia Le", date: "02/12/2021", status: 1 },
      { employeeId: 1, name: "Gia Le", date: "02/12/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "02/12/2021", status: -1 },
      { employeeId: 5, name: "Minh Tri", date: "02/12/2021", status: -1 },
      { employeeId: 2, name: "Quoc Hai", date: "02/12/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "02/12/2021", status: 0 },
      { employeeId: 2, name: "Quoc Hai", date: "02/12/2021", status: 1 },
      { employeeId: 1, name: "Gia Le", date: "02/12/2021", status: -1 },
      { employeeId: 1, name: "Gia Le", date: "02/12/2021", status: 1 },
      { employeeId: 1, name: "Gia Le", date: "02/12/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "02/12/2021", status: -1 },
      { employeeId: 5, name: "Minh Tri", date: "02/12/2021", status: -1 },
      { employeeId: 2, name: "Quoc Hai", date: "02/12/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "02/12/2021", status: 0 },
      { employeeId: 2, name: "Quoc Hai", date: "02/12/2021", status: 1 },

      { employeeId: 1, name: "Gia Le", date: "03/12/2021", status: -1 },
      { employeeId: 5, name: "Minh Tri", date: "03/12/2021", status: -1 },
      { employeeId: 2, name: "Quoc Hai", date: "03/12/2021", status: -1 },
      { employeeId: 1, name: "Gia Le", date: "03/12/2021", status: -1 },
      { employeeId: 1, name: "Gia Le", date: "03/12/2021", status: 1 },

      { employeeId: 1, name: "Gia Le", date: "04/12/2021", status: 1 },
      { employeeId: 5, name: "Minh Tri", date: "04/12/2021", status: 1 },
      { employeeId: 2, name: "Quoc Hai", date: "04/12/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "04/12/2021", status: 0 },
      { employeeId: 5, name: "Minh Tri", date: "04/12/2021", status: 1 },
      { employeeId: 2, name: "Quoc Hai", date: "04/12/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "04/12/2021", status: -1 },
      { employeeId: 5, name: "Minh Tri", date: "04/12/2021", status: -1 },
      { employeeId: 2, name: "Quoc Hai", date: "04/12/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "04/12/2021", status: -1 },
      { employeeId: 5, name: "Minh Tri", date: "04/12/2021", status: -1 },

      { employeeId: 2, name: "Quoc Hai", date: "05/12/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "05/12/2021", status: -1 },
      { employeeId: 5, name: "Minh Tri", date: "05/12/2021", status: -1 },
      { employeeId: 2, name: "Quoc Hai", date: "05/12/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "05/12/2021", status: -1 },
      { employeeId: 5, name: "Minh Tri", date: "05/12/2021", status: -1 },
    ],
  },
  {
    id: 2,
    name: "Ca chiều",
    fromTime: "12:00",
    toTime: "16:00",
    scheduleList: [
      { employeeId: 1, name: "Gia Le", date: "29/11/2021", status: 1 },
      { employeeId: 5, name: "Minh Tri", date: "29/11/2021", status: -1 },
      { employeeId: 2, name: "Quoc Hai", date: "29/11/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "29/11/2021", status: 1 },
      { employeeId: 5, name: "Minh Tri", date: "29/11/2021", status: 1 },
      { employeeId: 2, name: "Quoc Hai", date: "29/11/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "29/11/2021", status: -1 },
      { employeeId: 5, name: "Minh Tri", date: "29/11/2021", status: 0 },

      { employeeId: 1, name: "Gia Le", date: "30/11/2021", status: 1 },
      { employeeId: 5, name: "Minh Tri", date: "30/11/2021", status: 1 },
      { employeeId: 2, name: "Quoc Hai", date: "30/11/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "30/11/2021", status: 0 },
      { employeeId: 5, name: "Minh Tri", date: "30/11/2021", status: 1 },
      { employeeId: 2, name: "Quoc Hai", date: "30/11/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "30/11/2021", status: -1 },
      { employeeId: 5, name: "Minh Tri", date: "30/11/2021", status: -1 },
      { employeeId: 2, name: "Quoc Hai", date: "30/11/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "30/11/2021", status: -1 },
      { employeeId: 5, name: "Minh Tri", date: "30/11/2021", status: -1 },
      {
        employeeId: 1,
        employeeId: 1,
        name: "Gia Le",
        date: "30/11/2021",
        status: -1,
      },
      { employeeId: 5, name: "Minh Tri", date: "30/11/2021", status: -1 },

      { employeeId: 1, name: "Gia Le", date: "01/12/2021", status: 1 },
      { employeeId: 5, name: "Minh Tri", date: "01/12/2021", status: 1 },
      { employeeId: 2, name: "Quoc Hai", date: "01/12/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "01/12/2021", status: 1 },
      { employeeId: 5, name: "Minh Tri", date: "01/12/2021", status: 1 },
      { employeeId: 2, name: "Quoc Hai", date: "01/12/2021", status: -1 },
      { employeeId: 1, name: "Gia Le", date: "01/12/2021", status: 1 },
      { employeeId: 5, name: "Minh Tri", date: "01/12/2021", status: 0 },

      { employeeId: 1, name: "Gia Le", date: "02/12/2021", status: -1 },
      { employeeId: 5, name: "Minh Tri", date: "02/12/2021", status: -1 },
      { employeeId: 2, name: "Quoc Hai", date: "02/12/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "02/12/2021", status: 0 },
      { employeeId: 2, name: "Quoc Hai", date: "02/12/2021", status: 1 },
      { employeeId: 1, name: "Gia Le", date: "02/12/2021", status: 0 },
      { employeeId: 2, name: "Quoc Hai", date: "02/12/2021", status: 1 },
      { employeeId: 1, name: "Gia Le", date: "02/12/2021", status: 0 },

      { employeeId: 1, name: "Gia Le", date: "03/12/2021", status: -1 },
      { employeeId: 5, name: "Minh Tri", date: "03/12/2021", status: -1 },
      { employeeId: 2, name: "Quoc Hai", date: "03/12/2021", status: -1 },
      { employeeId: 1, name: "Gia Le", date: "03/12/2021", status: -1 },
      { employeeId: 1, name: "Gia Le", date: "03/12/2021", status: 1 },
      { employeeId: 1, name: "Gia Le", date: "03/12/2021", status: -1 },
      { employeeId: 1, name: "Gia Le", date: "03/12/2021", status: 1 },

      { employeeId: 1, name: "Gia Le", date: "04/12/2021", status: 1 },
      { employeeId: 5, name: "Minh Tri", date: "04/12/2021", status: 1 },
      { employeeId: 2, name: "Quoc Hai", date: "04/12/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "04/12/2021", status: 0 },
      { employeeId: 5, name: "Minh Tri", date: "04/12/2021", status: 1 },
      { employeeId: 2, name: "Quoc Hai", date: "04/12/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "04/12/2021", status: -1 },
      { employeeId: 5, name: "Minh Tri", date: "04/12/2021", status: -1 },
      { employeeId: 2, name: "Quoc Hai", date: "04/12/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "04/12/2021", status: -1 },

      { employeeId: 2, name: "Quoc Hai", date: "05/12/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "05/12/2021", status: -1 },
      { employeeId: 5, name: "Minh Tri", date: "05/12/2021", status: -1 },
      { employeeId: 2, name: "Quoc Hai", date: "05/12/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "05/12/2021", status: -1 },
      { employeeId: 5, name: "Minh Tri", date: "05/12/2021", status: -1 },
      { employeeId: 2, name: "Quoc Hai", date: "05/12/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "05/12/2021", status: -1 },
      { employeeId: 5, name: "Minh Tri", date: "05/12/2021", status: -1 },
    ],
  },
];

const shiftInfoMonth = [
  {
    id: 1,
    name: "Ca sáng",
    fromTime: "07:00",
    toTime: "12:00",
    scheduleList: [
      // Moi employee chỉ 1 hàng trong 1 ngày -> cái này copy paste nên còn sai
      // them employeeInfo(employeeId , employeeRole, employyePhone,...),cheduleID,...
      { employeeId: 1, name: "Gia Le", date: "29/11/2021", status: 1 },
      { employeeId: 2, name: "Quoc Hai", date: "29/11/2021", status: -1 },
      {
        employeeId: 3,
        name: "Mai Truong Khang",
        date: "29/11/2021",
        status: 0,
      },
      {
        employeeId: 4,
        name: "Mai Huynh Tuan Kiet",
        date: "29/11/2021",
        status: 1,
      },
      { employeeId: 5, name: "Minh Tri", date: "29/11/2021", status: 1 },

      { employeeId: 2, name: "Quoc Hai", date: "01/11/2021", status: -1 },
      { employeeId: 1, name: "Gia Le", date: "01/11/2021", status: 1 },
      { employeeId: 5, name: "Minh Tri", date: "01/11/2021", status: 0 },

      { employeeId: 1, name: "Gia Le", date: "02/11/2021", status: -1 },
      { employeeId: 5, name: "Minh Tri", date: "02/11/2021", status: -1 },
      { employeeId: 2, name: "Quoc Hai", date: "02/11/2021", status: 0 },
      {
        employeeId: 4,
        name: "Mai Huynh Tuan Kiet",
        date: "02/11/2021",
        status: 1,
      },

      { employeeId: 1, name: "Gia Le", date: "03/11/2021", status: -1 },
      { employeeId: 5, name: "Minh Tri", date: "03/11/2021", status: -1 },
      { employeeId: 2, name: "Quoc Hai", date: "03/11/2021", status: -1 },

      { employeeId: 1, name: "Gia Le", date: "04/11/2021", status: 1 },
      { employeeId: 5, name: "Minh Tri", date: "04/11/2021", status: 1 },
      { employeeId: 2, name: "Quoc Hai", date: "04/11/2021", status: 0 },

      { employeeId: 2, name: "Quoc Hai", date: "05/11/2021", status: 0 },
      { employeeId: 1, name: "Gia Le", date: "05/11/2021", status: -1 },
      { employeeId: 5, name: "Minh Tri", date: "05/11/2021", status: -1 },

      { employeeId: 1, name: "Gia Le", date: "30/11/2021", status: 1 },
      { employeeId: 5, name: "Minh Tri", date: "30/11/2021", status: 1 },
      { employeeId: 2, name: "Quoc Hai", date: "30/11/2021", status: 0 },
    ],
  },
  {
    id: 2,
    name: "Ca chiều",
    fromTime: "12:00",
    toTime: "16:00",
    scheduleList: [
      { employeeId: 1, name: "Gia Le", date: "01/11/2021", status: 1 },
      { employeeId: 2, name: "Quoc Hai", date: "02/11/2021", status: -1 },
    ],
  },
];
