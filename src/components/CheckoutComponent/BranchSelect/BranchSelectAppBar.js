import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import branchApi from "../../../api/branchApi";
import { infoActions } from "../../../store/slice/infoSlice";
import { useDispatch } from "react-redux";
export default function BranchSelectAppBar({ store_uuid }) {
  const [selectedBranch, setSelectedBranch] = React.useState({});
  const [branches, setBranches] = React.useState([]);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setSelectedBranch(event.target.value);
    dispatch(
      infoActions.setBranch({
        uuid: event.target.value.uuid,
        name: event.target.value.name,
        id: event.target.value.id,
      })
    );
  };

  const loadingData = async () => {
    try {
      let response = await branchApi.getBranches(store_uuid);
      setBranches(response.data);
      setSelectedBranch(response.data[0]);
      dispatch(
        infoActions.setBranch({
          uuid: response.data[0].uuid,
          name: response.data[0].name,
          id: response.data[0].id,
        })
      );
    } catch(err) {
      console.log(err)
    }
  };

  React.useEffect(() => {
    if (store_uuid) {
      loadingData();
    }
  }, [store_uuid]);

  const renderMenuItem = () => {
    return branches.map((branch) => {
      return <MenuItem value={branch}>{branch.name}</MenuItem>;
    });
  };

  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth>
      <InputLabel>Chi nhánh</InputLabel>
      <Select value={selectedBranch} label="Chi nhánh" onChange={handleChange}>
        {renderMenuItem()}
      </Select>
    </FormControl>
  );
}
