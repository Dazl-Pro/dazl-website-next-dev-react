/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import FormControl from "@mui/material/FormControl";
import "./commonRoomForm.css";
import { useDispatch } from "react-redux";
import { phdRooms } from "../../../store/dashboard/dashboardSlice";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const CommonRoomform = (props) => {
  const {
    setShow,
    setSelectvalue,
    selectValue,
    show,
    setInitialFields,
    width,
  } = props;
  const dispatch = useDispatch();

  const { handleSubmit, control } = useForm();
  const fieldOptions = [
    { value: 7, name: "Basement/Lower level" },
    { value: 10, name: "Bath-Additional" },
    { value: 29, name: "Bedroom-Primary" },
    // { value: 2, name: "Bed-Primary" },
    { value: 3, name: "Bath-Primary" },
    { value: 9, name: "Bedroom-Additional" },
    { value: 24, name: "Bonus room" },
    { value: 13, name: "Breakfast Area" },
    { value: 17, name: "Dining room" },
    { value: 8, name: "Exterior Front" },
    { value: 27, name: "Exterior Sides& Rear" },
    { value: 28, name: "Foyery Entry" },
    { value: 6, name: "Garage/Carport" },
    { value: 26, name: "Hearth Room" },
    { value: 11, name: "Home Office/Library" },
    { value: 1, name: "Kitchen" },
    { value: 4, name: "Laundry" },
    { value: 16, name: "Library" },
    { value: 25, name: "Living Room" },
    { value: 18, name: "Loft/Bonus Area" },
    { value: 5, name: "Mechanic Room" },
    { value: 14, name: "Media" },
    { value: 15, name: "Mud Room" },
    { value: 12, name: "Sitting/Formal Room" },
    { value: 23, name: "Walk-In Pantry" },
  ];
  const setInitialFieldsCalled = useRef(false);
  useEffect(() => {
    if (show && !setInitialFieldsCalled.current) {
      setInitialFields();
      setInitialFieldsCalled.current = true;
    }
  }, [show, setInitialFields]);

  const onFieldSelect = (selectedValue) => {
    localStorage.setItem("roomselect", JSON.stringify(selectedValue.name));
    localStorage.setItem("roomId", selectedValue.value);
    setSelectvalue(selectedValue.name);
    dispatch(phdRooms(selectedValue.value))
      .unwrap()
      .then(() => {
        setShow(true);
      });
  };

  const onSubmit = () => {};
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl fullWidth variant="outlined" margin="normal">
        <label className="form-label text-start">Select Field</label>
        <Controller
          name="selectedField"
          className=""
          control={control}
          defaultValue={selectValue === "" ? selectValue : ""}
          render={({ field }) => (
            <Autocomplete
              className={`${width}`}
              {...field}
              value={selectValue}
              onChange={(event, newValue) => {
                const option = fieldOptions.find(
                  (opt) => opt.name === newValue
                );
                onFieldSelect(option || { value: "", name: "" });
              }}
              options={fieldOptions.map((option) => option.name)}
              renderInput={(params) => <TextField {...params} />}
            />
          )}
        />
      </FormControl>
    </form>
  );
};

export default CommonRoomform;
