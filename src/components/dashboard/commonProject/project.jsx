import React, { useEffect, useState, useRef } from "react";
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

const Commonproject = ({
  show,
  setShow,
  selectValue,
  setSelectvalue,
  name,
}) => {
  const selector = useSelector((state) => state.dashboardSlice);
  const phdRooms = selector.data.phdRoomsData;
  const addAnotherRoomState = selector.data.addAnotherRoom;
  const roomtype = selector.data.roomtype;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [checkboxValues, setCheckboxValues] = React.useState(
    Array(phdRooms?.length).fill(false)
  );
  const [errorBorder, setErrorBorder] = useState(false);

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
  // const isLastFieldFilled = () => {
  //   const lastIndex = fields.length - 1;
  //   const lastImageField = selectedImages[lastIndex];
  //   return lastImageField !== "";
  // };
  // const isLastFieldFilled = () => {
  //   // if (fields.length === 0) return true;
  //   const lastIndex = fields.length - 1;
  //   const lastImageField = selectedImages[lastIndex];
  //   const lastTextValue = textValues[lastIndex] || "";
  //   return lastImageField && lastTextValue.trim() !== "";
  // };
  const groupByRoomId = (data) => {
    const groupedData = data.reduce((acc, item) => {
      const { roomId, features, inspectionNotes, images } = item;
      const existingRoom = acc.find((room) => room.roomId === roomId);

      if (existingRoom) {
        existingRoom.features.push({ features, inspectionNotes, images });
      } else {
        acc.push({
          roomId,
          features: [{ features, inspectionNotes, images }],
        });
      }
      return acc;
    }, []);

    return groupedData;
  };

  const handleGetCheckboxValues = () => {
    console.log("===============");
    let payload;
    if (location.pathname === "/agent/createProject") {
      payload = "realtorprojects";
    } else {
      payload = "projects";
    }

    const groupedDataImages = groupByRoomId(selectedImages);

    console.log("object", groupedDataImages);

    const roomId = localStorage.getItem("roomId");

    const projectID = localStorage.getItem("projectID");

    const selectedCheckboxes = checkboxValues
      .map((isChecked, index) => {
        if (isChecked) {
          if (!textValues[index] || "") {
            setErrorBorder(true);
            return;
          }
          return {
            roomId,
            projectID,
            features: phdRooms[index].id, // Assuming phdRooms contains the ids
            inspectionNotes: textValues[index] || "", // Include description if provided
          };
        }

        return null;
      })
      .filter((item) => item !== null);

    const groupedData = groupByRoomId(selectedCheckboxes);

    console.log("groupedData", groupedData);

    const completeData = mergeFeatures(groupedData, groupedDataImages);

    if (ImagesFinal === true) {
      console.log("11111111");
      let completedPromises = 0;
      if (selectedImages.length === 0) {
        console.log("2222222222222");
        if (groupedData.length > 0) {
          console.log("33333333333333");
          // Dispatch room ID and selected checkboxes (checkboxId and descriptions) when no images are selected
          groupedData.forEach((item) => {
            dispatch(
              addAnotherRoom({
                roomId,
                projectID,
                features: item.features,
                inspectionNotes: item.inspectionNotes,
              })
            )
              .unwrap()
              .then((response) => {
                const data = [...selectImagesFinal, response];
                dispatch(addRoomFeatures({ data, payload, name, projectID }))
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
                    localStorage.removeItem("projectID");
                    localStorage.removeItem("value");
                    localStorage.removeItem("projectItem");
                  });
              });
          });
        } else {
          console.log("444444444444");
          dispatch(
            addAnotherRoom({
              roomId,
              projectID,
            })
          )
            .unwrap()
            .then((response) => {
              const data = [...selectImagesFinal, response];
              dispatch(addRoomFeatures({ data, payload, name, projectID }))
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
                  localStorage.removeItem("projectID");
                  localStorage.removeItem("value");
                  localStorage.removeItem("projectItem");
                });
            });
        }
      } else {
        console.log("5555555555");
        completeData.forEach((item) => {
          dispatch(addAnotherRoom(item))
            .unwrap()
            .then((response) => {
              const data = [...selectImagesFinal, response];
              console.log("5555555555", data);
              dispatch(addRoomFeatures({ data, payload, name, projectID }))
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
                  localStorage.removeItem("projectID");
                  localStorage.removeItem("value");
                  localStorage.removeItem("projectItem");
                });
            });
        });
      }
    } else {
      console.log("6666666666");
      if (selectedImages.length === 0) {
        console.log("7777777777777");
        if (selectedCheckboxes.length > 0) {
          console.log("88888888888");
          dispatch(
            addRoomFeatures({
              data: groupedData,
              payload,
              name,
              projectID,
            })
          )
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
              localStorage.removeItem("projectID");
              localStorage.removeItem("value");
              localStorage.removeItem("projectItem");
            });
        } else {
          console.log("999999999999ß");
          dispatch(
            addRoomFeatures({
              data: [{ roomId: roomId, projectID }],
              payload,
              name,
              projectID,
            })
          )
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
              localStorage.removeItem("projectID");
              localStorage.removeItem("value");
              localStorage.removeItem("projectItem");
            });
        }
      } else {
        console.log("00000000000", selectedImages);
        console.log("PAYLOAD ", mergeData(selectedImages, groupedData));
        const data = mergeData(selectedImages, groupedData);
        // dispatch(addRoomFeatures({ selectedImages, payload, name, projectID }))
        dispatch(addRoomFeatures({ data: data.data, payload, name, projectID }))
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
            localStorage.removeItem("projectID");
            localStorage.removeItem("value");
            localStorage.removeItem("projectItem");
          });
      }
    }
  };

  function mergeData(dataWithImages, dataWithoutImages) {
    let mergedData = dataWithoutImages.map((room) => {
      return {
        roomId: room.roomId,
        features: room.features.map((feature) => {
          let match = dataWithImages.find(
            (imgFeature) => imgFeature.features === feature.features
          );
          if (match) {
            return { ...feature, images: match.images };
          }
          return feature;
        }),
      };
    });

    return {
      data: mergedData,
      name: "",
      projectID: null,
    };
  }

  function mergeFeatures(baseData, imageData) {
    const imageMap = new Map();

    // Create a map of features with images
    imageData.forEach((room) => {
      room.features.forEach((feature) => {
        imageMap.set(
          `${room.roomId}-${feature.features}`,
          feature.images || []
        );
      });
    });

    // Merge images into base data
    baseData.forEach((room) => {
      room.features.forEach((feature) => {
        const key = `${room.roomId}-${feature.features}`;
        if (imageMap.has(key)) {
          feature.images = imageMap.get(key);
        }
      });
    });

    return baseData;
  }

  const addAnother = () => {
    setImagesFinal(true);
    const roomId = localStorage.getItem("roomId");
    const projectID = localStorage.getItem("projectID");
    const groupedDataImages = groupByRoomId(selectedImages);
    // Check if there are no selected images
    console.log("|||||||||=-=-=-=-=-", groupedDataImages);
    const selectedCheckboxes = checkboxValues
      .map((isChecked, index) => {
        if (isChecked) {
          return {
            roomId,
            projectID,
            features: phdRooms[index].id, // Assuming phdRooms contains the ids
            inspectionNotes: textValues[index] || "", // Include description if provided
            // Include description if provided
          };
        }
        return null;
      })
      .filter((item) => item !== null); // Filter out null values
    const groupedData = groupByRoomId(selectedCheckboxes);

    console.log("|+|+|++|+=-=-=-=-=-", groupedData);

    const completeData = mergeFeatures(groupedData, groupedDataImages);

    console.log("|+|+|++|+=", completeData);
    if (selectedImages.length === 0) {
      // Collect checkbox IDs and descriptions for the selected checkboxes
      console.log("-=-=-=-=-=-=-=-", groupedData);

      if (groupedData.length > 0) {
        // Dispatch room ID and selected checkboxes (checkboxId and descriptions) when no images are selected
        groupedData.forEach((item) => {
          console.log("object");
          dispatch(
            addAnotherRoom({
              roomId,
              projectID,
              features: item.features,
              inspectionNotes: item.inspectionNotes,
            })
          )
            .unwrap()
            .then((response) => {
              setShow(false);
              setSelectvalue("");
              setCheckboxValues(Array(phdRooms?.length).fill(false));
              setTextValues([]);
              Toastify({
                data: "success",
                msg: "Room saved with selected checkboxes and descriptions. You can add more.",
              });
            });
        });
      } else {
        // If no checkboxes are selected, just dispatch the room ID
        dispatch(addAnotherRoom({ roomId, projectID }))
          .unwrap()
          .then((response) => {
            setShow(false);
            setSelectvalue("");
            setCheckboxValues(Array(phdRooms?.length).fill(false));
            setTextValues([]);
            Toastify({
              data: "success",
              msg: "Room saved without images or checkboxes. You can add more.",
            });
          });
      }
    } else {
      // Process selected images and room ID as in the original code
      completeData.forEach((item) => {
        dispatch(addAnotherRoom(item))
          .unwrap()
          .then((response) => {
            setShow(false);
            setSelectvalue("");
            setCheckboxValues(Array(phdRooms?.length).fill(false));
            setTextValues([]);
            reset({ photos: [] });
          });
      });
      Toastify({
        data: "success",
        msg: "Your item is saved, now you can add more.",
      });
    }

    setSelectedImages([]);
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
                // featureOptionIssues: [],
                features: phd.id,
                // imageDesc: [],
                images: [responseImage],
                inspectionNotes: textValues[index],
                roomId: localStorage.getItem("roomId"),
                projectID: localStorage.getItem("projectID"),
                // realtor_id: localStorage.getItem("userId"),
              };
              setSelectedImages((prevData) => [...prevData, newItem]);
            } else {
              const newItem = {
                // featureOptionIssues: [],
                features: phd.id,
                // imageDesc: [],
                images: [responseImage],
                inspectionNotes: textValues[index],
                roomId: localStorage.getItem("roomId"),
                projectID: localStorage.getItem("projectID"),
                // realtor_id: localStorage.getItem("userId"),
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
        // width="w-50"
      />
      {show ? (
        <>
          <p className="mt-3 text-start">
            What items in this area would you like to dazl up ?
          </p>
          {phdRooms?.map((_, index) => {
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
                      placeholder="Tell us what you would like to Dazl Up?"
                      className={`text-areamt w-100 fs-3 form-control ${
                        errorBorder ? "error" : ""
                      }`}
                      multiline
                      rows={4}
                      variant="outlined"
                      required
                      value={textValues[index] || ""}
                      // value={textValues[index] ? textValues[index] : ""}
                      onChange={(e) => handleChange(index, e.target.value)}
                    />
                    {errorBorder && !textValues[index] && (
                      <p className="text-danger mt-2">Note is required.</p>
                    )}
                    {/* Image Upload Fields */}
                    <div className="form-row bg-light rounded-2 btn-mt">
                      <div className="row">
                        <p className="mt-3 text-start">
                          Add Photos of inspiration or issues.
                        </p>
                        {fields?.map((field, imgIndex) => {
                          return field.indexId === index ? (
                            <div className="col-md-6 mt-3" key={imgIndex}>
                              <div className="d-flex align-items-start gap-2">
                                <input
                                  type="file"
                                  className={`form-control ${
                                    errors.photos &&
                                    errors?.photos[imgIndex]?.file
                                      ? "error"
                                      : ""
                                  }`}
                                  accept=".png, .jpg, .jpeg"
                                  onChange={(e) => handleImage(_, imgIndex, e)}
                                />
                                {errors.file && (
                                  <p className="text-danger mt-2">
                                    {errors.file.message}
                                  </p>
                                )}
                                {fields.length > 11 && (
                                  <button
                                    type="button"
                                    onClick={() => remove(imgIndex)}
                                    className="btn btn-light bg-light-red border-danger space"
                                  >
                                    <DeleteIcon />
                                  </button>
                                )}
                                {/* Show error if no images are uploaded */}
                                {fields.filter(
                                  (field) => field.indexId === index
                                ).length === 0 && (
                                  <p className="text-danger mt-2">
                                    At least one image is required.
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            ""
                          );
                        })}
                      </div>
                      {/* {fields.filter((field) => field.indexId === index)
                        .length < 5 && ( */}
                      {/* // disabled={fields.length === 0 || !isLastFieldFilled()} */}
                      {fields.filter((field) => field.indexId === index)
                        .length < 5 && (
                        <button
                          type="button"
                          className="btn btn-primary my-3"
                          onClick={() => append({ indexId: index, file: null })}
                          // disabled={fields.length === 0 || !isLastFieldFilled()}
                        >
                          Upload More
                        </button>
                      )}
                      {/* )} */}
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
