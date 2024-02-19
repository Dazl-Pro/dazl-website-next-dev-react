import React, { useEffect, useRef } from "react";
import {
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
} from "@material-ui/core";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import CommonRoomform from "../commonForm/commonRoomForm";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  addAnotherRoom,
  addRoomFeatures,
  uploadImage,
} from "../../../store/dashboard/dashboardSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { Toastify } from "../../../services/toastify/toastContainer";
import "./project.css";

const photosSchema = yup.array().of(
  yup.object().shape({
    file: yup
      .mixed()
      .required("File is required")
      .test("fileType", "Only image files are allowed", (value) => {
        if (!value) {
          return true; // If no file, skip validation
        }

        const supportedFormats = ["image/jpeg", "image/png", "image/gif"];

        return supportedFormats.includes(value.type);
      })
      .test("fileSize", "File size is too large", (value) => {
        const maxSize = 1024 * 1024 * 5; // 5 MB as an example, adjust as needed
        return !value || (value && value.size <= maxSize);
      }),
    description: yup.string(),
  })
);

const schema = yup.object().shape({
  photos: photosSchema,
});

const Commonproject = () => {
  const selector = useSelector((state) => state.dashboardSlice);
  const phdRooms = selector.data.phdRooms;
  const addAnotherRoomState = selector.data.addAnotherRoom;
  const roomtype = selector.data.roomtype;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [show, setShow] = React.useState(false);
  const [checkboxValues, setCheckboxValues] = React.useState(
    Array(phdRooms?.length).fill(false)
  );
  const [selectValue, setSelectvalue] = React.useState("");
  const [selectedImages, setSelectedImages] = React.useState([]);
  const [selectImagesFinal, setselectImagesFinal] = React.useState([]);
  const [ImagesFinal, setImagesFinal] = React.useState(false);
  const [textValues, setTextValues] = React.useState([]);
  const [fileUploadError, setFileUploadError] = React.useState(null);
  const [showErrors, setShowErrors] = React.useState(false);
  const projectValue = JSON.parse(localStorage.getItem("value"));
  const handleCheckboxChange = (index) => {
    const newCheckboxValues = [...checkboxValues];
    newCheckboxValues[index] = !newCheckboxValues[index];
    setCheckboxValues(newCheckboxValues);
  };
  useEffect(() => {
    if (addAnotherRoomState || projectValue) {
      let val;
      if (projectValue === null) {
        val = [];
      }
      const v = addAnotherRoomState ?? val;
      setselectImagesFinal(v);
    }
  }, [projectValue, addAnotherRoomState]);

  const defaultValues = {
    photos: Array.from({ length: phdRooms.length }, (_, index) => ({
      indexId: index,
      image: null,
    })),
  };

  const {
    control,
    setError,
    clearErrors,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "photos",
  });

  const setInitialFields = () => {
    defaultValues.photos.forEach((photo) => {
      const isIndexAlreadyPresent = fields.some(
        (field) => field.indexId === photo.indexId
      );
      if (!isIndexAlreadyPresent) {
        append(photo);
      }
    });
  };

  const handleChange = (index, value) => {
    const updatedTextValues = [...textValues];
    updatedTextValues[index] = value;
    setTextValues(updatedTextValues);
  };

  const handleGetCheckboxValues = () => {
    let payload;
    if (selectedImages.length === 0) {
      console.log("error: no selected images", selectedImages.length);
      setShowErrors(true);
    } else if (showErrors === false) {
      if (location.pathname === "/agent/createProject") {
        payload = "realtorprojects";
      } else {
        payload = "projects";
      }
      if (ImagesFinal === true) {
        let completedPromises = 0;
        selectedImages.forEach((item) => {
          dispatch(addAnotherRoom(item))
            .unwrap()
            .then((response) => {
              const value = [...selectImagesFinal, response];
              dispatch(addRoomFeatures({ value, payload }))
                .unwrap()
                .then((res) => {
                  completedPromises++;
                  if (completedPromises === selectedImages.length) {
                    Toastify({ data: "success", msg: res.message });
                  }
                  if (location.pathname === "/agent/createProject") {
                    navigate("/agent/my-project");
                  } else {
                    navigate("/homeOwner/my-project");
                  }
                  setImagesFinal(false);
                  setShow(false);
                  setSelectvalue("");
                  setCheckboxValues(Array(phdRooms?.length).fill(false));
                  setTextValues([]);
                  setSelectedImages([]);
                  localStorage.removeItem("roomselect");
                  localStorage.removeItem("roomId");
                  localStorage.removeItem("value");
                });
            });
        });
      } else {
        dispatch(addRoomFeatures({ selectedImages, payload }))
          .unwrap()
          .then((res) => {
            Toastify({ data: "success", msg: res.message });
            if (location.pathname === "/agent/createProject") {
              navigate("/agent/my-project");
            } else {
              navigate("/homeOwner/my-project");
            }
            setImagesFinal(false);
            setShow(false);
            setSelectvalue("");
            setCheckboxValues(Array(phdRooms?.length).fill(false));
            setTextValues([]);
            setSelectedImages([]);
            localStorage.removeItem("roomselect");
            localStorage.removeItem("roomId");
            localStorage.removeItem("value");
          });
      }
    }
  };
  const addAnother = () => {
    if (selectedImages.length === 0) {
      console.log("error: no selected images", selectedImages.length);
      setShowErrors(true);
    } else {
      setImagesFinal(true);
      selectedImages.forEach((item) => {
        dispatch(addAnotherRoom(item))
          .unwrap()
          .then((response) => {
            setShow(false);
            setSelectvalue("");
            setCheckboxValues(Array(phdRooms?.length).fill(false));
            setTextValues([]);
          });
      });
      Toastify({
        data: "success",
        msg: "Your item is saved now you can add more ",
      });
      setSelectedImages([]);
      reset({
        photos: [],
      });
    }
  };
  const handleImage = (phd, index, e) => {
    const file = e.target.files[0];
    const isImage = file && file.type.startsWith("image/");
    clearErrors(`photos[${index}].file`);
    if (!isImage) {
      setError(`photos[${index}].file`, {
        type: "manual",
        message: "Invalid file type. Please select a valid image.",
      });
    } else {
      setFileUploadError(null);
      setShowErrors(false);
      const formData = new FormData();
      formData.append("image", file);
      dispatch(uploadImage(formData))
        .unwrap()
        .then((res) => {
          const responseImage = res.image;
          const featuresIdDataIndex = selectedImages.findIndex(
            (item) => item.features === phd.id
          );
          if (featuresIdDataIndex !== -1) {
            setSelectedImages((prevData) => {
              const newArray = [...prevData];
              const existingObject = { ...newArray[featuresIdDataIndex] };
              existingObject.images = [...existingObject.images, responseImage];
              newArray[featuresIdDataIndex] = existingObject;
              return newArray;
            });
          } else {
            if (location.pathname === "/agent/createProject") {
              const newItem = {
                featureOptionIssues: [],
                features: phd.id,
                imageDesc: [],
                images: [responseImage],
                inspectionNotes: textValues[index],
                roomId: localStorage.getItem("roomId"),
                realtor_id: localStorage.getItem("userId"),
              };
              setSelectedImages((prevData) => [...prevData, newItem]);
            } else {
              const newItem = {
                featureOptionIssues: [],
                features: phd.id,
                imageDesc: [],
                images: [responseImage],
                inspectionNotes: textValues[index],
                roomId: localStorage.getItem("roomId"),
              };
              setSelectedImages((prevData) => [...prevData, newItem]);
            }
          }
        });
    }
  };
  return (
    <>
      <CommonRoomform
        setShow={setShow}
        show={show}
        setSelectvalue={setSelectvalue}
        selectValue={selectValue}
        setInitialFields={setInitialFields}
      />
      {show ? (
        <>
          <p className="mt-3 text-start">
            What items in this area would you like to dazl up ?
          </p>
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
              <div
                key={index}
                className="form-row bg-light px-3 rounded-2 text-start bg"
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      // style={{
                      //   border: showErrors ? '1px solid red' : '',
                      // }}
                      className={`${showErrors ? "errorTerm" : ""}`}
                      checked={checkboxValues[index]}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  }
                  label={`${displayName}`}
                  className="w-100"
                />

                {checkboxValues[index] && (
                  <>
                    {/* Textarea */}
                    <TextField
                      // label={` ${_.name}`}
                      className="text-areamt w-100 form-control"
                      multiline
                      rows={4}
                      variant="outlined"
                      value={textValues[index] || ""}
                      onChange={(e) => handleChange(index, e.target.value)}
                    />
                    {/* Image Upload Fields */}
                    <div className="form-row bg-light rounded-2 btn-mt">
                      <div className="row">
                        {fields?.map((field, imgIndex) => {
                          return field.indexId === index ? (
                            <div className="col-md-6 mt-4" key={imgIndex}>
                              <div className="d-flex align-items-start gap-2">
                                <input
                                  type="file"
                                  className={`form-control ${
                                    errors.photos &&
                                    errors?.photos[imgIndex]?.file
                                      ? "error"
                                      : ""
                                  }`}
                                  accept="image/*"
                                  onChange={(e) => handleImage(_, imgIndex, e)}
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
                      <button
                        type="button"
                        className="btn btn-primary  my-3"
                        onClick={() => append({ indexId: index, file: null })}
                      >
                        upload image
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}

          <Button
            variant="contained"
            className="btn btn-danger btn-sizee"
            onClick={addAnother}
            // disabled={selectedImages?.length === 0 ? true : false}
            style={{
              margin: "0px 10px",
              marginTop: "20px",
            }}
          >
            Add another room
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGetCheckboxValues}
            // disabled={selectedImages?.length === 0 ? true : false}
            style={{
              backgroundColor: "#363030",
              color: "#fff",
              margin: "0px 10px",
              marginTop: "20px",
            }}
          >
            Submit
          </Button>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default Commonproject;
