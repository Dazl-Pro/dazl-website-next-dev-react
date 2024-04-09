/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  createPhd,
  updatePhd,
  uploadImage,
} from "../../../../store/dashboard/dashboardSlice";
import MicIcon from "@mui/icons-material/Mic";
import DeleteIcon from "@mui/icons-material/Delete";
import "./style.css";
import { Grid, TextField, MenuItem, FormLabel } from "@mui/material";
import {
  viewPhdAlt,
  phdRooms,
} from "../../../../store/dashboard/dashboardSlice";
import { Toastify } from "../../../../services/toastify/toastContainer";
import { useNavigate, useParams } from "react-router-dom";

const schema = yup.object().shape({
  photos: yup.array().of(
    yup.object().shape({
      description: yup.string().required("Description is required"),
      file: yup.mixed().required("File is required"),
    })
  ),
  textArea: yup.string(),
  selectedOption: yup.string().required("Please select an option"),
  textAreaUpper: yup.string().required("Text Area is required"),
  checkboxes: yup
    .array()
    .of(yup.boolean().oneOf([true], "Please check at least one checkbox")),
});

const EditPhd = (props) => {
  const { setShow, setSelectvalue } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const selector = useSelector((state) => state.dashboardSlice);

  const selectorPhd = useSelector((state) => state.dashboardSlice);
  const viewPhdData = selectorPhd?.data?.viewPhdAlt;

  useEffect(() => {
    dispatch(viewPhdAlt({ id: itemId, value: "open" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  const [roomIds, setRoomIds] = useState([]);

  useEffect(() => {
    if (viewPhdData && viewPhdData.length > 0) {
      const ids = viewPhdData[0].roominfo.map((item) => item.room_id);
      setRoomIds(ids);
    }
  }, [viewPhdData]);

  const [roomData, setRoomData] = useState("");

  useEffect(() => {
    // Initialize input state array
    const initialInputState = [];

    // Populate input state array with room descriptions and statuses
    viewPhdData?.[0]?.roominfo.forEach((room) => {
      const roomData = {
        roomId: room.room_id,
        description: room.description || "", // Use empty string if description is undefined
        status: room.status || "", // Use empty string if status is undefined
        additionalValues: room.additionalValues || [],
      };
      initialInputState.push(roomData);
    });

    // Set initial input state
    setInput(initialInputState);
  }, [viewPhdData]);

  useEffect(() => {
    const fetchRoomData = async () => {
      const promises = roomIds.map((id) => {
        return dispatch(phdRooms(id))
          .unwrap()
          .then((response) => ({ id, data: response }))
          .catch((error) => {
            console.error(`Error fetching room data for room ID ${id}:`, error);
            return { id, data: null }; // Or handle the error appropriately
          });
      });

      const roomDataArray = await Promise.all(promises);

      // Set the room data object in state or wherever you need it
      setRoomData(roomDataArray);

      // If all room data is successfully fetched, set show to true
      setShow(true);
    };

    if (roomIds.length > 0) {
      fetchRoomData();
    }
  }, [dispatch, roomIds]);

  const phdRoomsData = selector.data.phdRoomsData;

  const addValueData = selector.data.addValueData;
  const price = selector.data.price;
  const agentData = selector.data.agentData;
  const phdUserDetail = JSON.parse(localStorage.getItem("phdUserDetail"));
  const roomselect = JSON.parse(localStorage.getItem("roomselect"));
  const midValue = localStorage.getItem("midValue");
  const roomId = localStorage.getItem("roomId");
  const maxValue = localStorage.getItem("maxValue");
  const lowestValue = localStorage.getItem("lowestValue");
  const saved1 = JSON.parse(localStorage.getItem("saved1"));

  const [checked, setChecked] = useState(
    addValueData?.map((item) => ({ id: item.id, isChecked: false }))
  );
  const [outerImage, setOuterimage] = React.useState([]);
  const [input, setInput] = React.useState([]);

  const defaultValues = {
    photos: [{ file: null }],
    textArea: [],
    selectedOption: "",
    checkboxes: [],
    checkbox_photos: Array.from(
      { length: phdRoomsData?.length },
      (_, index) => ({
        indexId: index,
        image: null,
      })
    ),
  };

  const [selectedValues, setSelectedValues] = useState([]);
  const [selectdrop, setSelectdrop] = useState({});
  const [addValueCheckbox, setAddvalueCheckbox] = useState([]);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [errorBorder, setErrorborder] = useState(false);
  const [errorBorder1, setErrorborder1] = useState(false);
  const [errorBorder2, setErrorborder2] = useState(false);
  const [errorBorder3, setErrorborder3] = useState(false);
  const [phdCheckbox, setPhdCheckbox] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    getValues,
    watch,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    fields: photoFields,
    append: appendPhoto,
    remove: removePhoto,
  } = useFieldArray({
    control,
    name: "photos",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "checkbox_photos",
  });

  useEffect(() => {
    defaultValues?.checkbox_photos?.forEach((photo) => {
      const existingIndex = fields.findIndex(
        (field) =>
          field.indexId === photo.indexId &&
          field.file === photo.file &&
          field.description === photo.description
        // Customize the conditions based on your object structure
      );

      if (existingIndex === -1) {
        append(photo);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event, index, id) => {
    setChecked((prevChecked) =>
      prevChecked.map((item) =>
        item.id === id ? { ...item, isChecked: event.target.checked } : item
      )
    );
    const data = `room[${roomId}][additional][${index}]`;
    const val = id;
    const value = { data, val };
    setAddvalueCheckbox((prevCheckbox) => [...prevCheckbox, value]);
  };

  const handleCheckboxArrayChange = (id, index) => {
    setPhdCheckbox((prev) => [...prev, { checkbox: id.id }]);
    const checkboxes = watch("checkboxes") || [];
    checkboxes[index] = !checkboxes[index];
    setValue("checkboxes", checkboxes);
  };

  const save = (e, value) => {
    e.preventDefault();

    const selectedOption = input.options;

    let updatedPrice = price;

    if (selectedOption === "NEEDS DAZL") {
      updatedPrice = price * 0.85;
    } else if (selectedOption === "DAZLING") {
      updatedPrice = price * 1.15;
    }

    const checkboxes = watch("checkboxes") || [];

    const checkedCheckboxesData = phdCheckbox.filter(
      (checkbox, index) => checkboxes[index]
    );

    if (input) {
      let formData = new FormData();

      formData.append("lowest_price", lowestValue);
      formData.append("mid_price", midValue);
      formData.append("highest_price", maxValue);
      formData.append("dazlValue", updatedPrice);
      saved1 !== null ? "" : formData.append("true", true);
      formData.append("room_id", roomId);
      formData.append("phd_description", input?.phd_description);
      for (let i = 0; i < outerImage.length; i++) {
        formData.append(`images[${i}]`, outerImage[i]);
      }

      selectedValues.length > 0 &&
        selectedValues?.map((item, index) => {
          return formData.append(`${item.data}`, item.selectedValue);
        });
      if (
        addValueData.length > 0 &&
        Array.isArray(addValueCheckbox) &&
        addValueCheckbox.length > 0
      ) {
        addValueCheckbox.forEach((item, index) => {
          formData.append(`${item.data}`, item.val);
        });
      }

      phdCheckbox.length > 0 &&
        phdCheckbox?.forEach((item) => {
          const checkboxKey = `rooms[${roomId}][feature_status][${
            item.checkbox ?? "description"
          }]`;
          const descriptionKey = `rooms[${roomId}][feature_issues_images_descr][${item.checkbox}]`;
          const imagesKey = `rooms[${roomId}][feature_issues_images][${item.checkbox}]`;

          formData.append(checkboxKey, "NEEDS DAZL");
          formData.append(descriptionKey, item.description);
          item?.images?.forEach((image, imgIndex) => {
            const imageKey = `${imagesKey}[${imgIndex}]`;
            formData.append(imageKey, image);
          });
        });
      formData.append(`rooms[${roomId}][status]`, input.options);
      formData.append("zip_code", agentData.zip_code ?? "123456");
      formData.append("final", value === "save" ? 0 : 1);
      formData.append("house_id", saved1 !== null ? saved1.house_id : "");
      formData.append(
        "customer_id",
        saved1 !== null ? saved1.customer : undefined
      );
      saved1 !== null ? formData.append("project_id", saved1.project_id) : "";

      checkedCheckboxesData.length > 0 &&
        checkedCheckboxesData.forEach((item) => {
          const checkboxKey = `rooms[${roomId}][feature_status][${
            item.checkbox ?? "description"
          }]`;
          const descriptionKey = `rooms[${roomId}][feature_issues_images_descr][${item.checkbox}]`;
          const imagesKey = `rooms[${roomId}][feature_issues_images][${item.checkbox}]`;

          formData.append(checkboxKey, "NEEDS DAZL");
          formData.append(descriptionKey, item.description);
          item.images.forEach((image, imgIndex) => {
            const imageKey = `${imagesKey}[${imgIndex}]`;
            formData.append(imageKey, image);
          });
        });

      dispatch(updatePhd({ data: input, id: itemId }))
        .unwrap()
        .then((response) => {
          if (value === "save") {
            setShow(false);
            localStorage.setItem("saved1", JSON.stringify(response));
            setSelectvalue("");
            Toastify({
              data: "success",
              msg: "Your item is saved now you can add more ",
            });
          } else {
            navigate("/agent/phdproject");
            localStorage.removeItem("midValue");
            localStorage.removeItem("roomId");
            localStorage.removeItem("maxValue");
            localStorage.removeItem("lowestValue");

            localStorage.removeItem("roomselect");
            localStorage.removeItem("saved1");
          }
        });
    }
  };
  const handleImage = (index, e) => {
    const file = e.target.files[0];

    setErrorborder2(false);
    const isImage = file && file.type.startsWith("image/");
    clearErrors(`photos[${index}].file`);
    if (!isImage) {
      setError(`photos[${index}].file`, {
        type: "manual",
        message: "Invalid file type. Please select a valid image.",
      });
    } else {
      const formData = new FormData();
      formData.append("image", file);
      dispatch(uploadImage(formData))
        .unwrap()
        .then((res) => {
          const responseImage = res.image;

          const featuresIdDataIndex = outerImage.findIndex(
            (item) => item === responseImage
          );
          if (featuresIdDataIndex !== -1) {
            setOuterimage((prevData) => {
              const newArray = [...prevData];
              const existingObject = { ...newArray[featuresIdDataIndex] };
              existingObject.images = [...existingObject.images, responseImage];
              newArray[featuresIdDataIndex] = existingObject;
              return newArray;
            });
          } else {
            setOuterimage((prevData) => [...prevData, responseImage]);
          }
        });
    }
  };
  const handleCheckboxImage = (phd, index, description, e) => {
    const file = e.target.files[0];
    const isImage = file && file.type.startsWith("image/");
    clearErrors(`checkbox_photos[${index}].file`);
    if (!isImage) {
      setError(`checkbox_photos[${index}].file`, {
        type: "manual",
        message: "Invalid file type. Please select a valid image.",
      });
    } else {
      setErrorborder3(false);
      setFileUploadError(null);
      const formData = new FormData();
      formData.append("image", file);
      dispatch(uploadImage(formData))
        .unwrap()
        .then((res) => {
          const responseImage = res.image;
          const textArray = getValues("textArea");
          setPhdCheckbox((prev) => {
            const newArray = [...prev];
            let updated = false; // Flag to check if an existing entry has been updated
            // Check if an object with the same checkbox ID exists in the array
            const desc = textArray[index];
            newArray.forEach((item, i) => {
              if (item.checkbox === phd.id) {
                newArray[i] = {
                  checkbox: phd.id,
                  description: description,
                  images: [...(item.images || []), responseImage],
                };
                updated = true;
              }
            });
            // If no existing entry was updated, create a new entry
            if (!updated) {
              newArray.push({
                checkbox: phd.id,
                description: textArray[index],
                images: [responseImage],
              });
            }

            return newArray;
          });
        });
    }
  };

  const getAudio = async () => {
    Toastify({ data: "error", msg: "Your device may not have this feature" });
  };

  const onChange = (e, roomId, name) => {
    const value = e.target.value;

    // Find the index of the room in the input state array
    const roomIndex = input.findIndex((room) => room.roomId === roomId);

    // If the room exists in the input state array, update its description
    if (roomIndex !== -1) {
      setInput((prevState) => {
        const updatedRooms = [...prevState];
        updatedRooms[roomIndex] = {
          ...updatedRooms[roomIndex],
          [name]: value,
        };
        return updatedRooms;
      });
    }

    // Reset error border based on the name
    if (name === "phd_description") {
      setErrorborder(false);
    } else {
      setErrorborder1(false);
    }
  };

  // Function to handle changes in selected values for each room
  // Function to handle changes in selected values for each room
  const handleValueChange = (roomId, valueId, isChecked) => {
    setInput((prevState) =>
      prevState.map((room) => {
        if (room.roomId === roomId) {
          const updatedValues = [...room.additionalValues];
          const existingIndex = updatedValues.findIndex(
            (item) => item.id === valueId
          );
          if (existingIndex !== -1) {
            updatedValues[existingIndex].isChecked = isChecked;
          } else {
            updatedValues.push({ id: valueId, isChecked });
          }
          return { ...room, additionalValues: updatedValues };
        }
        return room;
      })
    );
  };

  console.log("inputttt", input);

  return (
    <div>
      {viewPhdData?.[0].roominfo.map((items, index) => {
        return (
          <div key={index} className="mb-5">
            <h4 className="mb-4 text-danger">
              {items.room_name || roomselect}:
            </h4>
            <form>
              <div className="mb-3">
                <div className="">
                  <p className="mb-1">
                    1.Note any exceptional features or selling advantages:
                    <MicIcon
                      onClick={getAudio}
                      className=""
                      style={{ cursor: "pointer" }}
                    />
                  </p>
                </div>
                <div className="">
                  <TextField
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    {...register(`textArea[${index}]`)}
                    name={`${items.room_id}`}
                    value={
                      input.find((room) => room.roomId === items.room_id)
                        ?.description || ""
                    }
                    onChange={(e) => onChange(e, items.room_id, "description")}
                    required
                    className={`${errorBorder ? "error" : ""} `}
                  />
                </div>
              </div>
              <div className="mb-3">
                <p className="mb-1">
                  {" "}
                  2.Add photos of exceptional features or selling advantages
                </p>
                <div className="bg-light p-3 rounded-2">
                  <div className="row form-row ">
                    {photoFields.map((item, index) => (
                      <div className="col-md-6" key={item.id}>
                        <div className="d-flex align-items-start gap-2">
                          <input
                            type="file"
                            {...register(`photos[${index}].file`)}
                            className={`form-control mb-3 ${
                              (errors.photos && errors?.photos[index]?.file) ||
                              errorBorder2
                                ? "error"
                                : ""
                            }`}
                            accept="image/*"
                            onChange={(e) => handleImage(index, e)}
                          />
                          {photoFields.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-light bg-light-red border-danger space"
                              onClick={() => removePhoto(index)}
                            >
                              <DeleteIcon />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="d-flex justify-content-start align-items-center mt-3">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => appendPhoto({ file: null })}
                  >
                    Upload more
                  </button>
                </div>
              </div>

              {roomData[index]?.data?.roomtype?.length > 0 ? (
                <>
                  <Grid container spacing={2}>
                    {roomData[index]?.data.roomtype.map((item, roomIndex) => (
                      <Grid item xs={6} key={roomIndex}>
                        <FormLabel component="legend" className="text-body">
                          {item?.type?.name}
                        </FormLabel>
                        <TextField
                          sx={{ width: "50%" }}
                          id={`outlined-select-currency-${index}`}
                          select
                          label="Select"
                          variant="filled"
                          size="small"
                          className="mob-space w-100"
                          value={
                            selectdrop[`${index}-${item?.type?.name}`] || ""
                          }
                          onChange={(event) =>
                            onChange(event, items.room_id, "flooring")
                          }
                        >
                          {item?.type?.feature_options?.map(
                            (option, optionIndex) => (
                              <MenuItem key={optionIndex} value={option?.id}>
                                {option?.name}
                              </MenuItem>
                            )
                          )}
                        </TextField>
                      </Grid>
                    ))}
                  </Grid>
                </>
              ) : (
                ""
              )}

              {roomData[index]?.data?.addValueData?.length > 0 ? (
                <>
                  <p component="legend" className="mt-3 mb-1">
                    {" "}
                    3. Are there any additional value added items
                  </p>
                  <div className="row">
                    {roomData[index]?.data?.addValueData.map(
                      (valueItem, valueIndex) => {
                        const valueId = valueItem.id;

                        return (
                          <div
                            className="col-md-4 d-flex align-items-center"
                            key={valueIndex}
                          >
                            <Checkbox
                              checked={input
                                .find((room) => room.roomId === items.room_id)
                                ?.additionalValues.some(
                                  (item) =>
                                    item.id === valueId && item.isChecked
                                )}
                              onChange={(e) =>
                                handleValueChange(
                                  items.room_id,
                                  valueId,
                                  e.target.checked
                                )
                              }
                              inputProps={{ "aria-label": "controlled" }}
                            />

                            {valueItem.name}
                          </div>
                        );
                      }
                    )}
                  </div>
                </>
              ) : (
                ""
              )}
              <div className="mt-2 mb-2">
                <FormLabel className="text-body">
                  Overall first impressions
                </FormLabel>
                <RadioGroup
                  aria-label={`${items.room_id}`}
                  name={`${items.room_id}`}
                  value={
                    input.find((room) => room.roomId === items.room_id)
                      ?.status || ""
                  }
                  onChange={(e) => onChange(e, items.room_id, "status")}
                  required
                >
                  <div className="row">
                    <div className="col-md-4 d-flex align-items-center">
                      <FormControlLabel
                        value="DAZLING"
                        className="me-2"
                        control={
                          <Radio
                            className={`${errorBorder1 ? "errorSub" : ""} `}
                          />
                        }
                        label="DAZLING"
                      />
                    </div>
                    <div className="col-md-4 d-flex align-items-center">
                      <FormControlLabel
                        value="MARKET READY"
                        className="me-2"
                        control={
                          <Radio
                            className={`${errorBorder1 ? "errorSub" : ""} `}
                          />
                        }
                        label="MARKET READY"
                      />
                    </div>
                    <div className="col-md-4 d-flex align-items-center">
                      <FormControlLabel
                        value="NEEDS DAZL"
                        className="me-2"
                        control={
                          <Radio
                            className={`${errorBorder1 ? "errorSub" : ""} `}
                          />
                        }
                        label="NEEDS DAZL"
                      />
                    </div>
                  </div>
                </RadioGroup>
                {errors.selectedOption && (
                  <span className="text-danger">
                    {errors.selectedOption.message}
                  </span>
                )}
              </div>
              <p className="mb-1">Buyer Road Blocks or Recommendations?</p>
              <div className="bg-light rounded-2 py-2 px-3">
                <div className="">
                  {roomData[index]?.data?.data.map((_, index) => {
                    if (
                      _.name === "Light Fixtures" ||
                      _.name === "Plumbing Issues (Leaks)"
                    ) {
                      return null;
                    }
                    const displayName =
                      _.name === "Plumbing Fixtures" ? "Plumbing" : _.name;
                    return (
                      <div key={index} className="form-row">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={watch(`checkboxes[${index}]`) || false}
                              onChange={() =>
                                handleCheckboxArrayChange(_, index)
                              }
                            />
                          }
                          label={`${displayName}`}
                        />

                        {watch(`checkboxes[${index}]`) && (
                          <>
                            <TextField
                              multiline
                              rows={4}
                              variant="outlined"
                              fullWidth
                              {...register(`textArea[${index}]`)}
                            />
                            <div className="form-row bg-light rounded-2">
                              <div className="row">
                                {fields?.map((field, imgIndex) => {
                                  return field.indexId === index ? (
                                    <div
                                      className="col-md-6 mt-4"
                                      key={imgIndex}
                                    >
                                      <div className="d-flex align-items-start gap-2">
                                        <input
                                          type="file"
                                          className={`form-control ${
                                            errors?.checkbox_photos &&
                                            errors?.checkbox_photos[imgIndex]
                                              ?.file
                                              ? "error"
                                              : ""
                                          }`}
                                          accept="image/*"
                                          onChange={(e) =>
                                            handleCheckboxImage(
                                              _,
                                              imgIndex,
                                              getValues("textArea")[index],
                                              e
                                            )
                                          }
                                        />
                                        {fields.length > 11 && (
                                          <button
                                            type="button"
                                            onClick={() => remove(imgIndex)}
                                            className="btn btn-light bg-light-red border-danger space"
                                          >
                                            <DeleteIcon />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  );
                                })}
                              </div>
                            </div>
                            <button
                              type="button"
                              className="btn btn-success btn btn-primary my-3"
                              onClick={() =>
                                append({ indexId: index, file: null })
                              }
                            >
                              upload more
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </form>
          </div>
        );
      })}
      <div className="btnsubmit my-3 text-center">
        <button
          type="submit"
          className="btn btn-danger"
          onClick={(e) => save(e, "save")}
        >
          Add another room
        </button>
        <button
          className="room btn btn-success m-2"
          onClick={(e) => save(e, "submit")}
        >
          Complete
        </button>
      </div>
    </div>
  );
};

export default EditPhd;
