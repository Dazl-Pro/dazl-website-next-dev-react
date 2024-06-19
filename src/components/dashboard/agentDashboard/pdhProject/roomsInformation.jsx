/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-key */
import React, { useEffect, useState, useRef } from "react";
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
  uploadImage,
} from "../../../../store/dashboard/dashboardSlice";
// import "@material-ui/icons/Stop";
import MicIcon from "@mui/icons-material/Mic";

// import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import DeleteIcon from "@mui/icons-material/Delete";
import "./style.css";
import {
  Box,
  Grid,
  TextField,
  Button,
  InputAdornment,
  MenuItem,
  FormLabel,
  Typography,
} from "@mui/material";
import { Toastify } from "../../../../services/toastify/toastContainer";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  photos: yup.array().of(
    yup.object().shape({
      description: yup.string().required("Description is required"),
      file: yup.mixed().required("File is required"),
    })
  ),
  textArea: yup.string(),
  selectedOption: yup.string().required("Please select an option"),
  // checkboxes: yup.array().of(yup.boolean()),
  textAreaUpper: yup.string().required("Text Area is required"),
  checkboxes: yup
    .array()
    .of(yup.boolean().oneOf([true], "Please check at least one checkbox")),
});

const RoomsInformation = (props) => {
  const { setShow, setSelectvalue } = props;
  const navigate = useNavigate();
  const selector = useSelector((state) => state.dashboardSlice);
  const phdRooms = selector.data.phdRoomsData;

  const roomtype = selector.data.roomtype;
  const addValueData = selector.data.addValueData;
  const price = selector.data.price;
  const phdStepOne = selector.data.phdStepOne;
  const agentData = selector.data.agentData;
  const phdUserDetail = JSON.parse(localStorage.getItem("phdUserDetail"));
  const roomselect = JSON.parse(localStorage.getItem("roomselect"));
  const midValue = localStorage.getItem("midValue");
  const roomId = localStorage.getItem("roomId");
  const maxValue = localStorage.getItem("maxValue");
  const lowestValue = localStorage.getItem("lowestValue");
  const phdvalue = JSON.parse(localStorage.getItem("phdValue"));
  const userId = localStorage.getItem("userId");
  const saved1 = JSON.parse(localStorage.getItem("saved1"));

  const [checked, setChecked] = useState(
    addValueData.map((item) => ({ id: item.id, isChecked: false }))
  );
  const [active, setActive] = React.useState(false);
  const [outerImage, setOuterimage] = React.useState([]);
  const [checkboxImages, setCheckboximages] = React.useState([]);
  const [input, setInput] = React.useState({
    phd_description: "",
    options: "",
  });

  const defaultValues = {
    photos: [{ file: null }],
    textArea: [],
    selectedOption: "",
    checkboxes: [],
    checkbox_photos: Array.from({ length: phdRooms?.length }, (_, index) => ({
      indexId: index,
      image: null,
    })),
  };
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectdrop, setSelectdrop] = useState({});
  const [addValueCheckbox, setAddvalueCheckbox] = useState([]);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [errorBorder, setErrorborder] = useState(false);
  const [errorBorder1, setErrorborder1] = useState(false);
  const [errorBorder2, setErrorborder2] = useState(false);
  const [errorBorder3, setErrorborder3] = useState(false);
  const [fileValue, setFileValue] = useState([]);
  const dataBox = [{ checkbox: null, description: "", images: [] }];
  const [phdCheckbox, setPhdCheckbox] = useState([]);
  const [recording, setRecording] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const mediaRecorderRef = useRef(null);

  const dispatch = useDispatch();
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
    setPhdCheckbox((prev) => {
      const existingIndex = prev.findIndex((item) => item.checkbox === id.id);
      if (existingIndex !== -1) {
        // If the id is already present, remove it
        const updatedCheckbox = [...prev];
        updatedCheckbox.splice(existingIndex, 1);
        return updatedCheckbox;
      } else {
        // If the id is not present, add it
        return [...prev, { checkbox: id.id }];
      }
    });

    const checkboxes = watch("checkboxes") || [];
    checkboxes[index] = !checkboxes[index];
    setValue("checkboxes", checkboxes);
  };

  const save = (e, value) => {
    e.preventDefault();

    const selectedOption = input.options;

    // Calculate price based on the selected option
    let updatedPrice = price; // Initialize with the default price

    if (selectedOption === "NEEDS DAZL") {
      // Reduce price by 15% for 'NEEDS DAZL'
      updatedPrice = price * 0.85;
    } else if (selectedOption === "DAZLING") {
      // Increase price by 15% for 'DAZLING'
      updatedPrice = price * 1.15;
    }

    // Get the values of the checkboxes
    const checkboxes = watch("checkboxes") || [];

    // Filter out unchecked checkboxes
    const checkedCheckboxesData = phdCheckbox.filter(
      (checkbox, index) => checkboxes[index]
    );

    // Perform other validations
    if (input.phd_description === "") {
      setErrorborder(true);
      return;
    }
    if (input.options === "") {
      setErrorborder1(true);
      return;
    }

    // Check if road block descriptions are provided for all selected checkboxes
    const roadBlocksDescriptions = fields.map(
      (field) => watch(`textArea[${field.indexId}]`) || ""
    );
    const roadBlocksChecked = watch("checkboxes") || [];
    const roadBlocksIncomplete = roadBlocksChecked.some((checked, index) => {
      return checked && !roadBlocksDescriptions[index];
    });

    if (roadBlocksIncomplete) {
      Toastify({
        data: "error",
        msg: "Please provide descriptions for all selected road blocks.",
      });
      return;
    }

    if (input.phd_description && input.options) {
      let formData = new FormData();
      formData.append("score", 100);
      formData.append("address", phdUserDetail?.location);
      formData.append("first_name", phdUserDetail?.firstName);
      formData.append("last_name", phdUserDetail?.lastName);
      formData.append("client_email", phdUserDetail?.email);
      formData.append("type", phdvalue?.type);
      formData.append("year_built", phdvalue?.year_built);
      formData.append("bedrooms", phdvalue?.bedrooms);
      formData.append("bathrooms", phdvalue?.bathrooms);
      formData.append("structure_type", phdvalue?.structure_type);
      formData.append("lot_size", phdvalue?.lot_size);
      formData.append("location", phdUserDetail?.location);
      formData.append("foundation_type", phdvalue?.foundation_type);
      formData.append("tax_accessed_value", phdvalue?.tax_accessed_value);
      formData.append("sale_date", phdvalue?.sale_date);
      formData.append("lowest_price", lowestValue);
      formData.append("left", `calc(-50% - "4px")`);
      formData.append("mid_price", midValue);
      formData.append("highest_price", maxValue);
      formData.append("dazlValue", updatedPrice);
      saved1 !== null ? "" : formData.append("true", true);
      formData.append("room_id", roomId);
      formData.append("phd_description", input?.phd_description);
      for (let i = 0; i < outerImage.length; i++) {
        formData.append(`images[${i}]`, outerImage[i]);
      }
      roomtype.length > 0 &&
        selectedValues.length > 0 &&
        selectedValues?.map((item, index) => {
          return formData.append(`${item.data}`, item.selectedValue);
        });
      if (
        addValueData.length > 0 &&
        Array.isArray(addValueCheckbox) &&
        addValueCheckbox.length > 0
      ) {
        addValueCheckbox?.forEach((item, index) => {
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
        checkedCheckboxesData?.forEach((item) => {
          const checkboxKey = `rooms[${roomId}][feature_status][${
            item.checkbox ?? "description"
          }]`;
          const descriptionKey = `rooms[${roomId}][feature_issues_images_descr][${item.checkbox}]`;
          const imagesKey = `rooms[${roomId}][feature_issues_images][${item.checkbox}]`;

          formData.append(checkboxKey, "NEEDS DAZL");
          formData.append(descriptionKey, item.description);
          item.images?.forEach((image, imgIndex) => {
            const imageKey = `${imagesKey}[${imgIndex}]`;
            formData.append(imageKey, image);
          });
        });

      dispatch(createPhd(formData))
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
            navigate(`/agent/viewPhdAlt/${response.id}`);
            localStorage.removeItem("midValue");
            localStorage.removeItem("roomId");
            localStorage.removeItem("maxValue");
            localStorage.removeItem("lowestValue");
            localStorage.removeItem("phdValue");
            localStorage.removeItem("roomselect");
            localStorage.removeItem("saved1");
          }
        });
    }
  };
  const handleImage = (index, e) => {
    const file = e.target.files[0];
    setFileValue(file);
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
            newArray?.forEach((item, i) => {
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
  // const startRecording = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //     setAudioStream(stream);

  //     const mediaRecorder = new MediaRecorder(stream);
  //     mediaRecorderRef.current = mediaRecorder;

  //     mediaRecorder.ondataavailable = handleDataAvailable;
  //     mediaRecorder.start();

  //     setRecording(true);

  //     Toastify({
  //       text: "Audio recording started",
  //       backgroundColor: "#2ecc71",
  //     });
  //   } catch (error) {
  //     console.error("Error accessing microphone:", error);
  //     Toastify({
  //       text: "Error: Could not access microphone",
  //       backgroundColor: "#e74c3c",
  //     });
  //   }
  // };
  // const stopRecording = () => {
  //   if (mediaRecorderRef.current && audioStream) {
  //     mediaRecorderRef.current.stop();
  //     audioStream.getTracks().forEach((track) => track.stop());
  //     setRecording(false);
  //     setAudioStream(null);

  //     Toastify({
  //       text: "Audio recording stopped",
  //       backgroundColor: "#3498db",
  //     });
  //   }
  // };
  // const handleDataAvailable = (event) => {
  //   const audioBlob = new Blob([event.data], { type: "audio/wav" });
  //   console.log("Audio Blob:", audioBlob);
  //   saveAudioBlob(audioBlob);
  // };

  // const saveAudioBlob = (blob) => {
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.style.display = "none";
  //   a.href = url;
  //   a.download = "recording.wav";
  //   document.body.appendChild(a);
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  // };

  // const toggleRecording = () => {
  //   if (recording) {
  //     stopRecording();
  //   } else {
  //     startRecording();
  //   }
  // };

  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput({ ...input, [name]: value });
    if (name === "phd_description") {
      setErrorborder(false);
    } else {
      setErrorborder1(false);
    }
  };
  const handleSelectChange = (event, typeId, roomId, name) => {
    const selectedValue = event.target.value;
    const data = `rooms[${roomId}][feature_type][${typeId}]`;
    const value = { data, selectedValue };
    setSelectedValues([...selectedValues, value]);
    setSelectdrop((prevValues) => ({
      ...prevValues,
      [name]: selectedValue,
    }));
    // Add your logic or actions based on the selected value here
  };
  // const MAX_PHOTOS = 5;

  // const isLastFieldComplete = () => {
  //   return fields.length < MAX_PHOTOS;
  // // };
  // fileValue
  const isLastFieldComplete = () => {
    if (fields.length === 0) return true;
    const lastIndex = fields.length - 1;
    const lastImageField = fileValue[lastIndex];
    // const lastTextValue = textValues[lastIndex] || "";
    return lastImageField;
  };

  return (
    <div>
      <h4 className="mb-4 text-danger">{roomselect ?? ""}</h4>
      <form>
        {/* <div className="d-flex align-items-center mb-4">
          <input
            style={{ height: "27px", width: "20px" }}
            type="checkbox"
            checked={active == true}
            onClick={() => setActive(!active)}
          
          />
          <span className="" style={{ paddingLeft: "10px" }}>
            Has the basement been finished since last real estate transaction.{" "}
          </span>
        </div> */}
        <div className="mb-3">
          <div className="">
            <p className="mb-1">
              1.Note any exceptional features or selling advantages:
              {/* <MicIcon
                onClick={getAudio}
                className=""
                style={{ cursor: "pointer" }}
              />{" "} */}
            </p>
          </div>
          <div className="">
            <TextField
              // label="Common Text Area"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              {...register("textArea")}
              name={"phd_description"}
              // Validator={ errors }
              value={input.phd_description}
              onChange={onChange}
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
            {/* onClick={handleAppendPhoto} */}
            <button
              type="button"
              className="btn btn-success"
              onClick={() => {
                if (isLastFieldComplete()) {
                  appendPhoto({ description: "", file: null });
                }
              }}
            >
              Upload more
            </button>
            {/* onClick={() => {
                if (isLastFieldComplete()) {
                  appendPhoto({ description: "", file: null });
                }
              }} */}
          </div>
        </div>
        {roomtype?.length > 0 ? (
          <Grid container spacing={2}>
            {roomtype.map((item, index) => {
              return (
                <Grid item xs={6}>
                  <FormLabel component="legend" className="text-body">
                    {item?.type?.name}
                  </FormLabel>
                  <TextField
                    sx={{ width: "50%" }}
                    id="outlined-select-currency"
                    select
                    label="Select"
                    // defaultValue={defaultRegRole}
                    variant="filled"
                    size="small"
                    className="mob-space w-100"
                    value={selectdrop[item?.type?.name] || ""}
                    onChange={(event) =>
                      handleSelectChange(
                        event,
                        item?.type?.id,
                        item?.room_id,
                        item?.type?.name
                      )
                    }
                  >
                    {item?.type?.feature_options?.map((option, index) => (
                      <MenuItem key={index} value={option?.id}>
                        {option?.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              );
            })}{" "}
          </Grid>
        ) : (
          ""
        )}

        {addValueData?.length > 0 ? (
          <>
            <p component="legend" className="mt-3 mb-1">
              {" "}
              3. Are there any additional value added items
            </p>
            <div className="row">
              {addValueData.map((valueItem, index) => {
                return (
                  <div className="col-md-4 d-flex align-items-center">
                    <Checkbox
                      checked={
                        checked.find((item) => item.id === valueItem.id)
                          ?.isChecked
                      }
                      onChange={(e) => handleChange(e, index, valueItem.id)}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                    {valueItem?.name}
                    {valueItem.price && (
                      <div className="fst-italic text-danger ms-2 text-decoration-underline">
                        ${valueItem.price}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          ""
        )}
        <div className="mt-2 mb-2">
          <FormLabel className="text-body">Overall first impressions</FormLabel>
          <RadioGroup
            aria-label="options"
            name="options"
            value={input.options}
            onChange={onChange}
            required
          >
            <div className="row">
              <div className="col-md-4 d-flex align-items-center">
                <FormControlLabel
                  value="DAZLING"
                  className="me-2"
                  control={
                    <Radio className={`${errorBorder1 ? "errorSub" : ""} `} />
                  }
                  label="DAZLING"
                />
                <div className="fst-italic text-danger text-decoration-underline">
                  80% room value
                </div>
              </div>
              <div className="col-md-4 d-flex align-items-center">
                <FormControlLabel
                  value="MARKET READY"
                  className="me-2"
                  control={
                    <Radio className={`${errorBorder1 ? "errorSub" : ""} `} />
                  }
                  label="MARKET READY"
                />
                <div className="fst-italic text-danger text-decoration-underline">
                  50% room value
                </div>
              </div>
              <div className="col-md-4 d-flex align-items-center">
                <FormControlLabel
                  value="NEEDS DAZL"
                  className="me-2"
                  control={
                    <Radio className={`${errorBorder1 ? "errorSub" : ""} `} />
                  }
                  label="NEEDS DAZL"
                />
                <div className="fst-italic text-danger text-decoration-underline">
                  30% room value
                </div>
              </div>
            </div>
          </RadioGroup>
          {errors.selectedOption && (
            <span className="text-danger">{errors.selectedOption.message}</span>
          )}
        </div>
        <p className="mb-1">Buyer Road Blocks or Recommendations?</p>
        <div className="bg-light rounded-2 py-2 px-3">
          <div className="">
            {phdRooms.map((_, index) => {
              if (
                _.name === "Light Fixtures" ||
                _.name === "Plumbing Issues (Leaks)"
              ) {
                return null; // Skip this _
              }

              // Modify the name if it is 'Plumbing Fixtures'
              const displayName =
                _.name === "Plumbing Fixtures" ? "Plumbing" : _.name;
              return (
                <div key={index} className="form-row">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={watch(`checkboxes[${index}]`) || false}
                        onChange={() => handleCheckboxArrayChange(_, index)}
                      />
                    }
                    label={`${displayName}`}
                  />

                  {watch(`checkboxes[${index}]`) && (
                    <>
                      <TextField
                        // label={`Text Area for ${_.name}`}
                        multiline
                        rows={4}
                        variant="outlined"
                        fullWidth
                        {...register(`textArea[${index}]`)}
                        className={`${
                          watch(`textArea[${index}]`) === "" ? "error" : ""
                        } `}
                      />
                      <div className="form-row bg-light rounded-2">
                        <div className="row">
                          {fields?.map((field, imgIndex) => {
                            return field.indexId === index ? (
                              <div className="col-md-6 mt-4" key={imgIndex}>
                                <div className="d-flex align-items-start gap-2">
                                  <input
                                    type="file"
                                    className={`form-control ${
                                      errors?.checkbox_photos &&
                                      errors?.checkbox_photos[imgIndex]?.file
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
                        onClick={() => append({ indexId: index, file: null })}
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

        <div className="btnsubmit my-3 d-flex justify-content-between">
          <div>
            <button
              type="submit"
              className="btn btn-danger m-2"
              onClick={(e) => save(e, "save")}
              // disabled={input.phd_description && input.options ? false : true}
            >
              Add another room
            </button>
          </div>
          <button
            className="room btn btn-success m-2"
            onClick={(e) => save(e, "submit")}
          >
            Complete
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomsInformation;
