import React, { useState } from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import { Typography, Box, Card, Grid } from "@material-ui/core";
import store from "../../../assets/img/store.JPG";
import { grey } from "@material-ui/core/colors";
import EditBranch from "./EditBranch";

const useStyles = makeStyles((theme) =>
  createStyles({
    card: {
      background: theme.customization.mode === "Light" ? null : grey[800],
      borderRadius: theme.customization.borderRadius,
      color: "#000000",
      padding: 10,
      boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
      "&:hover": {
        boxShadow: " 0px 10px 10px rgba(0,0,0,0.2)",
      },
    },
  })
);

const BranchList = (props) => {
  const { branchList, setChosenBranch, getLocation, onReload } = props;
  const [isEditBranch, setIsEditBranch] = useState(false);
  const [branchToEdit, setBranchToEdit] = useState({
    name: "",
    address: "",
    ward: "",
    district: "",
    city: "",
    phone: "",
  });
  const theme = useTheme();
  const classes = useStyles(theme);
  return (
    <Grid container spacing={2}>
      {isEditBranch &&
        <EditBranch
          branch={branchToEdit}
          onReload={onReload}
          open={isEditBranch}
          handleClose={() => setIsEditBranch(false)}
        />
      }
      {branchList.map((branch) => {
        return (
          <Grid item xs={12} sm={6}>
            <Card className={classes.card} style={{ minHeight: 140 }}>
              {/* <CardContent style={{}}> */}
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box
                    component="img"
                    sx={{ height: "100%", width: "100%", borderRadius: 10 }}
                    src={branch.img_url ? branch.img_url : store}
                  />
                </Grid>
                <Grid item xs={8} style={{ minHeight: 140 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    style={{ color: grey[600], marginTop: 5 }}
                  >
                    {branch.name}
                  </Typography>
                  <Typography
                    gutterBottom
                    component="div"
                    style={{ fontSize: "1rem", fontWeight: 400, height: "60%" }}
                  >
                    {`${branch.address} ${branch.ward} ${branch.district} ${branch.province}`}
                  </Typography>
                  <Grid container direction="row" justifyContent="flex-end">
                    <Typography
                      onClick={() => {
                        //                         setChosenBranch({ lat: branch.lat, lng: branch.lng });
                        setChosenBranch({ lat: parseFloat(branch.lat), lng: parseFloat(branch.lng) });
                        window.scrollTo(0, 0);
                      }}
                      variant="h5"
                      style={{ cursor: "pointer", color: "#1b74e4" }}
                    >
                      Xem bản đồ
                    </Typography>
                    <Typography
                      onClick={() => {
                        getLocation(branch.lat, branch.lng);
                      }}
                      variant="h5"
                      style={{
                        cursor: "pointer",
                        color: "#1b74e4",
                        marginLeft: 10,
                      }}
                    >
                      Chỉ đường
                    </Typography>
                    <Typography
                      onClick={() => {
                        setBranchToEdit(branch);
                        setIsEditBranch(true);
                      }}
                      variant="h5"
                      style={{
                        cursor: "pointer",
                        color: "#1b74e4",
                        marginLeft: 10,
                      }}
                    >
                      Chỉnh sửa
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              {/* </CardContent> */}
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default BranchList;
