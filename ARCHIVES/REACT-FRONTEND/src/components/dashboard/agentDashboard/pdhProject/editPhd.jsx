/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Tooltip from "@mui/material/Tooltip";
import { Modal } from "react-bootstrap";
import {
  updatePhd,
  uploadImage,
} from "../../../../store/dashboard/dashboardSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import "./style.css";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  FormLabel,
  InputAdornment,
  Typography,
} from "@mui/material";
import {
  viewPhdAlt,
  phdRooms,
} from "../../../../store/dashboard/dashboardSlice";
import { Toastify } from "../../../../services/toastify/toastContainer";
import { useNavigate, useParams } from "react-router-dom";

const marks = [
  {
    value: 1,
    toolTip: "They walk in and first impression is Hell Naw! Walk Away...!",
  },
  {
    value: 2,
    toolTip: "Ok we can work with this...",
  },
  {
    value: 3,
    toolTip: "I've seen worst...",
  },
  {
    value: 4,
    toolTip: "Market Ready!",
  },
  {
    value: 5,
    toolTip: "This is Nice!",
  },
  {
    value: 6,
    toolTip: "Oh yeah... This looks good!",
  },
  {
    value: 7,
    toolTip: "Wow this has it all!",
  },
  {
    value: 8,
    toolTip: "I have to have this for myself!",
  },
];

const EditPhd = (props) => {
  const { setShow, setSelectvalue } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const selector = useSelector((state) => state.dashboardSlice);
  const selectorPhd = useSelector((state) => state.dashboardSlice);
  const viewPhdData = selectorPhd?.data?.viewPhdAlt;
  const [roomIds, setRoomIds] = useState([]);
  const phdRoomsArray = useSelector(
    (state) => state.dashboardSlice.data.phdRoomsData
  );

  // const phdRooms = selector.data.phdRoomsData;

  useEffect(() => {
    if (viewPhdData && viewPhdData.length > 0) {
      const ids = viewPhdData?.[0]?.roominfo?.map((item) => item.room_id);
      setRoomIds(ids);
    }
  }, [viewPhdData]);

  const [roomData, setRoomData] = useState("");

  const [input, setInput] = React.useState([]);

  console.log("viewPhdData =>", viewPhdData);
  console.log("roomIds =>", roomIds);
  console.log("roomData =>", roomData);

  console.log("input data  ==>", JSON.stringify(input));
  const handleChangeValue = (event, id) => {
    setInput((prevState) =>
      prevState?.map((room) => {
        if (room.roomId === id) {
          return { ...room, selectedOptionValue: event.target.value };
        }
        return room;
      })
    );
    if (event.target.value !== "yes") {
      setInput((prevState) =>
        prevState?.map((room) => {
          if (room.roomId === id) {
            return { ...room, selectedPrice: "", customPrice: "" };
          }
          return room;
        })
      );
    }
  };

  const handleSelectionChange = (event, id) => {
    const value = event.target.value;
    setInput((prevState) =>
      prevState?.map((room) => {
        if (room.roomId === id) {
          return { ...room, selectedPrice: event.target.value };
        }
        return room;
      })
    );
    if (value === "other") {
      setInput((prevState) =>
        prevState?.map((room) => {
          if (room.roomId === id) {
            return { ...room, customPrice: "" };
          }
          return room;
        })
      );
    }
  };

  useEffect(() => {
    const initialInputState = [];

    viewPhdData?.[0]?.roominfo?.forEach((room, index) => {
      const roomData = {
        roomId: room.room_id,
        block_slider_value: room.block_slider_value,
        description:
          room.description ||
          viewPhdData?.[0]?.images?.filter(
            (image) => image.room_id === room.room_id
          )[0]?.description ||
          "",
        status: room.status || "",
        additionalValues: room.additionalValues || [],
        mainImages: room.mainImages || [],
        selectedOptionValue: room.selectedOptionValue || "",
        selectedPrice: room.selectedPrice || "",
        customPrice: room.customPrice || "",
        roadBlocks:
          room.roadBlocks ||
          room.feature?.map((item) => ({
            id: item.feature_id,
            isChecked: true, // You can set this value as needed
            roadBlockDescription: item.imageDesc, // Set description as needed
            roadBlockImages: [], // Set images as needed
          })) ||
          [],
      };
      initialInputState.push(roomData);
    });

    setInput(initialInputState);
  }, [viewPhdData]);

  useEffect(() => {
    const fetchRoomData = async () => {
      const promises = roomIds?.map((id) => {
        return dispatch(phdRooms(id))
          .unwrap()
          .then((response) => ({ id, data: response }))
          .catch((error) => {
            return { id, data: null };
          });
      });

      const roomDataArray = await Promise.all(promises);

      setRoomData(roomDataArray);

      setShow(true);
    };

    if (roomIds.length > 0) {
      fetchRoomData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, roomIds]);

  const price = selector.data.price;
  const roomselect = JSON.parse(localStorage.getItem("roomselect"));
  const midValue = localStorage.getItem("midValue");
  const maxValue = localStorage.getItem("maxValue");
  const lowestValue = localStorage.getItem("lowestValue");
  const saved1 = JSON.parse(localStorage.getItem("saved1"));

  const [roomImagesObject, setRoomImagesObject] = useState([]);
  const [roomImagesObjectCheckbox, setRoomImagesObjectCheckbox] = useState([]);

  useEffect(() => {
    const updatedRoomImagesArray = viewPhdData?.[0]?.roominfo?.map((room) => {
      const images = viewPhdData?.[0]?.images?.filter(
        (image) => image.room_id === room.room_id
      );

      const imageUrls = images?.map((image) => image.url);
      return { room_id: room.room_id, images: imageUrls };
    });

    setRoomImagesObject(updatedRoomImagesArray || []);
  }, [viewPhdData]);

  useEffect(() => {
    const updatedRoomImagesArray = viewPhdData?.[0]?.roominfo?.map((room) => {
      const featuresWithImages = room.feature?.map((feature) => {
        const imageUrls = feature?.images?.map((image) => image);
        return {
          roadBlock_id: feature.feature_id,
          images: imageUrls,
        };
      });

      return {
        room_id: room.room_id,
        roadBlocks: featuresWithImages,
      };
    });

    setRoomImagesObjectCheckbox(updatedRoomImagesArray || []);
  }, [viewPhdData]);

  const [photoFields, setPhotoFields] = useState([]);
  const [photoFieldsCheckBox, setPhotoFieldsCheckBox] = useState([]);

  console.log("+++>", photoFieldsCheckBox);

  useEffect(() => {
    if (roomIds.length > 0) {
      const initialPhotoFields = roomIds?.map((roomId) => [{ file: null }]);
      setPhotoFields(initialPhotoFields);
    }
  }, [roomIds]);

  useEffect(() => {
    if (roomIds.length > 0) {
      const updatedRoomImagesArray = viewPhdData?.[0]?.roominfo?.map((room) => {
        const featuresWithImages = room.feature?.map((feature) => {
          const imageUrls = [{ file: null }];
          return {
            roadBlock_id: feature.feature_id,
            images: imageUrls,
          };
        });

        return {
          room_id: room.room_id,
          roadBlocks: featuresWithImages,
        };
      });

      setPhotoFieldsCheckBox(updatedRoomImagesArray || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomIds]);

  const appendPhoto = (roomId) => {
    setPhotoFields((prevPhotoFields) =>
      prevPhotoFields?.map((fields, index) =>
        index === roomId ? [...fields, { file: null }] : fields
      )
    );
  };

  const appendCheckBoxImages = (index, matchingRoadBlockIndex, file) => {
    setPhotoFieldsCheckBox((prevPhotoFieldsCheckBox) => {
      const updatedPhotoFieldsCheckBox = [...prevPhotoFieldsCheckBox];
      const currentImages =
        updatedPhotoFieldsCheckBox[index]?.roadBlocks?.[matchingRoadBlockIndex]
          ?.images || [];
      currentImages.push({ file });
      updatedPhotoFieldsCheckBox[index].roadBlocks[
        matchingRoadBlockIndex
      ].images = currentImages;
      return updatedPhotoFieldsCheckBox;
    });
  };

  const removePhoto = (roomId, index, mainIndex) => {
    // setPhotoFields((prevPhotoFields) =>
    //   prevPhotoFields?.map((fields, i) =>
    //     i === mainIndex ? fields.filter((data, j) => j !== index) : fields
    //   )
    // );
    setInput((prevState) =>
      prevState?.map((room) => {
        if (room.roomId === roomId) {
          const updatedMainImages = room.mainImages.filter(
            (image) => image?.id !== index
          );
          return { ...room, mainImages: updatedMainImages };
        }
        return room;
      })
    );
  };

  const removeCheckBoxImages = (index, imgIndex, matchingRoadBlockIndex) => {
    setPhotoFieldsCheckBox((prevPhotoFieldsCheckBox) => {
      const updatedPhotoFieldsCheckBox = [...prevPhotoFieldsCheckBox];
      const currentRoadBlocks =
        updatedPhotoFieldsCheckBox[index]?.roadBlocks?.[matchingRoadBlockIndex];
      if (currentRoadBlocks && currentRoadBlocks?.images) {
        currentRoadBlocks?.images.splice(imgIndex, 1);
      }
      return updatedPhotoFieldsCheckBox;
    });
  };

  const [descriptionError, setDescriptionError] = useState(false);

  const save = (e, value) => {
    e.preventDefault();

    const requiresDescription = input.some((room) =>
      room.roadBlocks.some(
        (block) => block.isChecked && !block.roadBlockDescription
      )
    );

    setDescriptionError(requiresDescription);

    // const selectedOption = input.options;
    // let updatedPrice = price;

    // if (selectedOption === "NEEDS DAZL") {
    //   updatedPrice = price * 0.85;
    // } else if (selectedOption === "DAZLING") {
    //   updatedPrice = price * 1.15;
    // }

    if (input) {
      let formData = new FormData();
      formData.append("lowest_price", lowestValue);
      formData.append("mid_price", midValue);
      formData.append("highest_price", maxValue);
      // formData.append("dazlValue", updatedPrice);
      saved1 !== null ? "" : formData.append("true", true);

      formData.append("final", value === "save" ? 0 : 1);
      formData.append("house_id", saved1 !== null ? saved1.house_id : "");
      formData.append(
        "customer_id",
        saved1 !== null ? saved1.customer : undefined
      );
      saved1 !== null ? formData.append("project_id", saved1.project_id) : "";

      if (input) {
        const updatedInput = input?.map((room) => {
          const roomImages = roomImagesObject.find(
            (imageRoom) => imageRoom.room_id === room.roomId
          );

          if (roomImages) {
            const existingImagesCount = room.mainImages.length;
            const updatedMainImages = [
              ...room.mainImages,
              ...roomImages.images.map((image, index) => ({
                id: existingImagesCount + index,
                responseImage: image,
              })),
            ].filter((image) => image.responseImage !== null);

            return {
              ...room,
              mainImages: updatedMainImages,
            };
          }

          return {
            ...room,
            mainImages: room.mainImages.filter(
              (image) => image.responseImage !== null
            ), // Remove null responseImages if no roomImages found
          }; // If no corresponding roomImages found, return the original room object
        });
        const updatedInputFinal = updatedInput.map((room) => {
          // Find the corresponding roomImages for the current room
          const roomImages = roomImagesObjectCheckbox.find(
            (imageRoom) => imageRoom.room_id === room.roomId
          );

          if (roomImages) {
            // Append images from roomImages to roadBlockImages for each road block
            const updatedRoadBlocks = room?.roadBlocks
              ?.map((block) => {
                const matchingImages = roomImages?.roadBlocks?.find(
                  (imageBlock) => imageBlock.roadBlock_id === block.id
                );

                if (matchingImages) {
                  const existingImagesCount = block.roadBlockImages?.length;
                  const mergedImages = [
                    ...block.roadBlockImages, // Keep existing images
                    ...(matchingImages?.images?.map((image, index) => ({
                      id: existingImagesCount + index, // Assuming you have an ID for each image
                      responseImage: image, // Assuming image structure contains responseImage
                    })) || []),
                  ].filter((image) => image.responseImage !== null);
                  return {
                    ...block,
                    roadBlockImages: mergedImages,
                  };
                }
                return {
                  ...block,
                  roadBlockImages: block.roadBlockImages.filter(
                    (image) => image.responseImage !== null
                  ), // Remove null responseImages
                };
              })
              .filter((block) => block.roadBlockDescription.trim() !== "");

            return {
              ...room,
              roadBlocks: updatedRoadBlocks,
            };
          }

          return {
            ...room,
            mainImages: room.mainImages.filter(
              (image) => image.responseImage !== null
            ), // Remove null responseImages
            roadBlocks: room.roadBlocks
              .map((block) => ({
                ...block,
                roadBlockImages: block.roadBlockImages.filter(
                  (image) => image.responseImage !== null
                ), // Remove null responseImages
              }))
              .filter((block) => block.roadBlockDescription.trim() !== ""), // Remove empty roadBlockDescriptions
          }; // If no corresponding roomImages found, return the original room object
        });
        console.log("updatedInputFinal ==>", updatedInputFinal);
        dispatch(
          updatePhd({
            data: updatedInputFinal,
            id: itemId,
          })
        )
          .unwrap()
          .then((response) => {
            if (value === "save") {
              setShow(false);
              localStorage.setItem("saved1", JSON.stringify(response));
              navigate("/agent/createPhd/rooms");
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
    }
  };

  function getMainImages(roomId) {
    const room = input?.find((item) => item.roomId === roomId);
    return room ? room.mainImages : [];
  }

  function getRoadBlockImages(roomId, roadBlockId) {
    const room = input?.find((item) => item.roomId === roomId);
    if (!room) return [];

    const roadBlock = room.roadBlocks.find((block) => block.id === roadBlockId);
    return roadBlock ? roadBlock.roadBlockImages : [];
  }

  const handleImage = (roomId, name, index, e, roadBlockIndex) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("image", file);
    dispatch(uploadImage(formData))
      .unwrap()
      .then((res) => {
        const responseImage = res.image;
        if (name === "main") {
          setInput((prevState) =>
            prevState?.map((room) => {
              if (room.roomId === roomId) {
                const updatedValues = [...room.mainImages];
                const existingIndex = updatedValues.findIndex(
                  (item) => item?.id === index
                );
                if (existingIndex !== -1) {
                  // Update the existing image or add a new one
                  updatedValues[existingIndex].responseImage = res.image; // Use res.image instead of responseImage
                } else {
                  updatedValues.push({
                    id: (updatedValues[updatedValues.length - 1]?.id || 0) + 1,
                    responseImage: res.image,
                  }); // Use res.image instead of responseImage
                }
                return { ...room, mainImages: updatedValues }; // Change additionalValues to mainImages
              }
              return room;
            })
          );
        } else if (name === "checkbox") {
          // Handle checkbox section image upload

          setInput((prevState) =>
            prevState?.map((room) => {
              if (room.roomId === roomId) {
                const updatedRoadBlocks = room.roadBlocks?.map(
                  (block, rbIndex) => {
                    if (rbIndex === roadBlockIndex) {
                      const updatedImages = [
                        ...(block.roadBlockImages || []),
                        {
                          id:
                            (block?.roadBlockImages[
                              block?.roadBlockImages?.length
                            ] || 0) + 1,
                          responseImage: res.image,
                        },
                      ];
                      return { ...block, roadBlockImages: updatedImages };
                    }
                    return block;
                  }
                );
                return { ...room, roadBlocks: updatedRoadBlocks };
              }
              return room;
            })
          );
        }
      });
  };

  const onChange = (e, roomId, name) => {
    const value = e.target.value;

    const roomIndex = input.findIndex((room) => room.roomId === roomId);
    if (name === "description" || name === "status") {
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
    } else {
      if (roomIndex !== -1) {
        setInput((prevState) => {
          const updatedRooms = [...prevState];
          updatedRooms[roomIndex] = {
            ...updatedRooms[roomIndex],
            type: {
              ...updatedRooms[roomIndex].type,
              [name]: value,
            },
          };
          return updatedRooms;
        });
      }
    }
  };

  const onChangeRoadBlockDescription = (e, roomId, name, index) => {
    const value = e.target.value;

    setInput((prevState) => {
      const updatedRooms = prevState?.map((room) => {
        if (room.roomId === roomId) {
          const updatedRoadBlocks = [...room.roadBlocks];
          updatedRoadBlocks[index] = {
            ...updatedRoadBlocks[index],
            [name]: value,
          };
          return {
            ...room,
            roadBlocks: updatedRoadBlocks,
          };
        }
        return room;
      });
      return updatedRooms;
    });
  };

  const removeRoadBlockImage = (roomId, roadBlockId, imageIndex) => {
    setInput((prevData) =>
      prevData.map((room) =>
        room.roomId === roomId
          ? {
              ...room,
              roadBlocks: room.roadBlocks.map((block) =>
                block.id === roadBlockId
                  ? {
                      ...block,
                      roadBlockImages: block.roadBlockImages.filter(
                        (_, index) => index !== imageIndex
                      ),
                    }
                  : block
              ),
            }
          : room
      )
    );
  };

  // const handleValueChange = (roomId, valueId, isChecked, name) => {
  //   setInput((prevState) =>
  //     prevState?.map((room) => {
  //       if (room.roomId === roomId) {
  //         if (name === "additionalValue") {
  //           const updatedValues = [...room.additionalValues];
  //           const existingIndex = updatedValues.findIndex(
  //             (item) => item?.id === valueId
  //           );
  //           if (existingIndex !== -1) {
  //             updatedValues[existingIndex].isChecked = isChecked;
  //           } else {
  //             updatedValues.push({ id: valueId, isChecked });
  //           }
  //           return { ...room, additionalValues: updatedValues };
  //         } else if (name === "roadBlocks") {
  //           const updatedValues = [...room.roadBlocks];
  //           const existingIndex = updatedValues.findIndex(
  //             (item) => item?.id === valueId
  //           );
  //           if (existingIndex !== -1) {
  //             updatedValues[existingIndex].isChecked = isChecked;
  //           } else {
  //             updatedValues.push({ id: valueId, isChecked });
  //           }
  //           return { ...room, roadBlocks: updatedValues };
  //         }
  //       }
  //       return room;
  //     })
  //   );
  //   if (name === "roadBlocks") {
  //     setPhotoFieldsCheckBox((prevPhotoFieldsCheckBox) => {
  //       const updatedPhotoFieldsCheckBox = [...prevPhotoFieldsCheckBox];
  //       const updatedPhotoFields = updatedPhotoFieldsCheckBox.map((photo) => {
  //         const roadBlocks = photo.roadBlocks || [];
  //         const existingIndex = roadBlocks.findIndex(
  //           (block) => block.roadBlock_id === valueId
  //         );

  //         if (existingIndex !== -1) {
  //           // If valueId is present, remove it
  //           roadBlocks.splice(existingIndex, 1);
  //         } else {
  //           // If valueId is not present, add it
  //           roadBlocks.push({
  //             roadBlock_id: valueId,
  //             images: [{ file: null }],
  //           });
  //         }

  //         return { ...photo, roadBlocks };
  //       });

  //       return updatedPhotoFields;
  //     });
  //   }
  // };

  const handleValueChange = (
    roomId,
    valueId,
    isChecked,
    category,
    index,
    matchingRoadBlockIndex,
    additionalValue,
    name
  ) => {
    setInput((prev) => {
      return prev.map((room) => {
        if (room.roomId === roomId) {
          let updatedRoadBlocks = [...room.roadBlocks];
          let currentValue = room.block_slider_value || 0;

          // Check if the checkbox is already checked
          const existingIndex = updatedRoadBlocks.findIndex(
            (item) => item.id === valueId
          );
          if (isChecked) {
            // Add the roadblock if not already there
            if (existingIndex === -1) {
              updatedRoadBlocks.push({
                id: valueId,
                isChecked: true,
                roadBlockDescription: "",
                roadBlockImages: [],
              });
              currentValue += phdRoomsArray[index]?.points || 0;
            }
          } else {
            // Remove the roadblock and decrease value
            if (existingIndex !== -1) {
              updatedRoadBlocks.splice(existingIndex, 1);
              currentValue -= phdRoomsArray[index]?.points || 0;
            }
          }

          // Ensure value doesn't exceed 110
          currentValue = Math.min(110, Math.max(0, currentValue));

          return {
            ...room,
            roadBlocks: updatedRoadBlocks,
            block_slider_value: currentValue,
          };
        }
        return room;
      });
    });
  };

  const handleRemoveImage = (room_id, imageIndex) => {
    const updatedRoomImagesObject = [...roomImagesObject];

    const roomIndex = updatedRoomImagesObject.findIndex(
      (room) => room.room_id === room_id
    );

    if (roomIndex !== -1) {
      const updatedImages = [...updatedRoomImagesObject[roomIndex].images];

      updatedImages.splice(imageIndex, 1);

      updatedRoomImagesObject[roomIndex] = {
        ...updatedRoomImagesObject[roomIndex],
        images: updatedImages,
      };

      setRoomImagesObject(updatedRoomImagesObject);
    }
  };

  const handleRemoveCheckBoxImage = (room_id, roadBlockIndex, imageIndex) => {
    setRoomImagesObjectCheckbox((prevRoomImages) => {
      const updatedRooms = prevRoomImages?.map((room) => {
        if (room.room_id === room_id) {
          const updatedRoadBlocks = room.roadBlocks?.[
            roadBlockIndex
          ]?.images.filter((image, index) => index !== imageIndex);

          return {
            ...room,
            roadBlocks: room.roadBlocks?.map((feature, index) => {
              if (index === roadBlockIndex) {
                return {
                  ...feature,
                  images: updatedRoadBlocks,
                };
              }
              return feature;
            }),
          };
        }
        return room;
      });

      return updatedRooms;
    });
  };

  // const handleChangee = (e, roomId, name) => {
  //   const value = e.target.value;
  //   const roomIndex = input.findIndex((room) => room.roomId === roomId);
  //   setInput((prevState) => {
  //     const updatedRooms = [...prevState];
  //     updatedRooms[roomIndex] = {
  //       ...updatedRooms[roomIndex],
  //       [name]: value,
  //     };
  //     return updatedRooms;
  //   });
  // };

  const handleChangee = (e, roomId, name) => {
    const value = e.target.value;
    const roomIndex = input.findIndex((room) => room.roomId === roomId);
    setInput((prevState) => {
      const updatedRooms = [...prevState];
      prevState.map((room) =>
        room.roomId === roomId ? { ...room, [name]: value } : room
      );
      updatedRooms[roomIndex] = {
        ...updatedRooms[roomIndex],
        [name]: value,
      };
      return updatedRooms;
    });
  };

  function ValueLabelComponent(props) {
    const { children, value } = props;

    const selectedValue = props.ownerState.marks.find(
      (mark) => mark.value === value
    );

    return (
      <Tooltip
        enterTouchDelay={0}
        placement="top"
        title={
          <div className="cs-tooltip-new bg-primary">
            {selectedValue.toolTip}
          </div>
        }
      >
        {children}
      </Tooltip>
    );
  }
  const [showModal, setShowModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  return (
    <div>
      {viewPhdData?.[0]?.roominfo?.map((items, index) => {
        const roomIdIn = items?.room_id;

        console.log("Main map ==>", items);
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
                  </p>
                </div>
                <div className="">
                  <TextField
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    name={`${items.room_id}`}
                    value={
                      input.find((room) => room.roomId === items.room_id)
                        ?.description || ""
                    }
                    onChange={(e) => onChange(e, items.room_id, "description")}
                    required
                    // className={`${errorBorder ? "error" : ""} `}
                  />
                </div>
              </div>
              <div className="mb-3">
                <p className="mb-1">
                  {" "}
                  2.Add photos of exceptional features or selling advantages
                </p>

                <div className="bg-light p-3 rounded-2">
                  <div className="ps-0 mb-3 mt-2">
                    <div className="d-flex gap-1 flex-wrap">
                      {roomImagesObject?.[index]?.images?.map(
                        (image, imageIndex) => (
                          <div key={imageIndex}>
                            {image && (
                              <div className="float-start me-4 position-relative">
                                <img
                                  alt="img"
                                  src={image}
                                  className="object-fit-cover border"
                                  width={"100px"}
                                  height={"100px"}
                                  onClick={() => {
                                    setSelectedImageUrl(image);
                                    setShowModal(true);
                                  }}
                                  style={{ cursor: "pointer" }}
                                />

                                <div className="d-flex justify-content-center dlt-btn-3">
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-sm mt-2 "
                                    onClick={() =>
                                      handleRemoveImage(
                                        roomImagesObject[index].room_id,
                                        imageIndex
                                      )
                                    }
                                  >
                                    <DeleteIcon />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      )}
                      {getMainImages(items?.room_id)?.map((image, index) => (
                        <div key={image?.id}>
                          {image && (
                            <div className="float-start me-4 position-relative">
                              <img
                                alt="img"
                                src={image?.responseImage}
                                className="object-fit-cover border"
                                width={"100px"}
                                height={"100px"}
                                onClick={() => {
                                  setSelectedImageUrl(image.responseImage);
                                  setShowModal(true);
                                }}
                                style={{ cursor: "pointer" }}
                              />

                              <div className="d-flex justify-content-center dlt-btn-3">
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm mt-2 "
                                  onClick={() =>
                                    removePhoto(
                                      items?.room_id,
                                      image?.id,
                                      index
                                    )
                                  }
                                >
                                  <DeleteIcon />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="row form-row ">
                    <input
                      id={`ImageUploadMain${index}`}
                      type="file"
                      className={`form-control mb-3 `}
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={(e) => {
                        console.log("1234=");
                        handleImage(items.room_id, "main", -1, e);
                      }}
                    />
                    {/* {photoFields[index]?.map((item, photoIndex) => (
                      <div className="col-md-6" key={photoIndex}>
                        <div className="d-flex align-items-start gap-2">
                          <input
                            type="file"
                            className={`form-control mb-3`}
                            accept="image/*"
                            onChange={(e) => {
                              console.log(
                                "image data => ",
                                items.room_id,
                                "main",
                                photoIndex,
                                e
                              );
                              handleImage(items.room_id, "main", photoIndex, e);
                            }}
                          />
                          {photoFields[index].length > 1 && (
                            <button
                              type="button"
                              className="btn btn-light bg-light-red border-danger space"
                              onClick={() =>
                                removePhoto(items.room_id, photoIndex, index)
                              }
                            >
                              <DeleteIcon />
                            </button>
                          )}
                        </div>
                      </div>
                    ))} */}
                  </div>
                </div>
                <div className="d-flex justify-content-start align-items-center mt-3">
                  <button
                    type="button"
                    className="btn btn-danger"
                    // onClick={() => appendPhoto(index)}
                    onClick={() =>
                      document.getElementById(`ImageUploadMain${index}`).click()
                    }
                  >
                    Add Photos
                  </button>
                </div>
              </div>
              {roomData[index]?.data?.roomtype?.length > 0 ? (
                <>
                  <Grid container spacing={2}>
                    {roomData[index]?.data.roomtype?.map((item, roomIndex) => (
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
                            input.find((room) => room.roomId === items.room_id)
                              ?.type?.[item?.type?.name] || ""
                          }
                          onChange={(event) =>
                            onChange(event, items.room_id, item?.type?.name)
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
              {/* {roomData[index]?.data?.addValueData?.length > 0 ? (
                <>
                  <p component="legend" className="mt-3 mb-1">
                    {" "}
                    3. Are there any additional value added items
                  </p>
                  <div className="row">
                    {roomData[index]?.data?.addValueData?.map(
                      (valueItem, valueIndex) => {
                        const valueId = valueItem?.id;

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
                                    item?.id === valueId && item.isChecked
                                )}
                              onChange={(e) =>
                                handleValueChange(
                                  items.room_id,
                                  valueId,
                                  e.target.checked,
                                  "additionalValue"
                                )
                              }
                              inputProps={{ "aria-label": "controlled" }}
                            />
                            {valueItem.name}
                            {valueItem.price && (
                              <div className="fst-italic text-danger ms-2 text-decoration-underline">
                                ${valueItem.price}
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </>
              ) : (
                ""
              )} */}
              {selector?.data?.roomtype?.[0]?.room_id === 7 && (
                <div className="mt-2 mb-2">
                  <FormLabel className="text-body">
                    {roomData[index]?.data?.addValueData?.length > 0
                      ? "4. "
                      : "3. "}
                    Has the basement been finished since last listing?
                  </FormLabel>
                  <RadioGroup
                    value={
                      input.find((room) => room.roomId === items.room_id)
                        ?.selectedOptionValue === "yes"
                        ? "yes"
                        : "no"
                    }
                    onChange={(event) =>
                      handleChangeValue(event, items.room_id)
                    }
                  >
                    <div className="d-flex gap-2">
                      <div className="d-flex align-items-center">
                        <Radio value="yes" />
                        Yes
                      </div>
                      <div className="d-flex align-items-center">
                        <Radio value="no" />
                        No
                      </div>
                    </div>
                  </RadioGroup>

                  {input.find((room) => room?.roomId === items?.room_id)
                    ?.selectedOptionValue === "yes" && (
                    <FormControl variant="outlined" className="mt-2 w-25">
                      <InputLabel id="dropdown-label">Select Value</InputLabel>
                      <Select
                        labelId="dropdown-label"
                        value={
                          input.find((room) => room?.roomId === items?.room_id)
                            ?.selectedPrice
                        }
                        onChange={(event) =>
                          handleSelectionChange(event, items?.room_id)
                        }
                        label="Select Value"
                      >
                        <MenuItem value={5000}>$5000</MenuItem>
                        <MenuItem value={10000}>$10000</MenuItem>
                        <MenuItem value={20000}>$20000</MenuItem>
                        <MenuItem value={50000}>$50000</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                  {input.find((room) => room?.roomId === items?.room_id)
                    ?.selectedPrice === "other" && (
                    <TextField
                      variant="outlined"
                      className="mt-2 w-25 ms-2"
                      label="Enter Custom Value"
                      value={
                        input.find((room) => room?.roomId === items?.room_id)
                          ?.customPrice
                      }
                      onChange={(event) =>
                        setInput((prevState) =>
                          prevState?.map((room) => {
                            if (room?.roomId === items?.room_id) {
                              return {
                                ...room,
                                customPrice: event.target.value,
                              };
                            }
                            return room;
                          })
                        )
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                  )}
                </div>
              )}
              <div className="mt-2 mb-2">
                <FormLabel className="text-body">
                  Overall first impressions
                </FormLabel>
                {/* <Box sx={{ width: "full", padding: 3 }}>
    <div className="slider-container position-relative">
      <div className="d-flex justify-content-between w-100">
        <p>0pts</p>
        <p>110pts</p>
      </div>

      <Slider
        marks={[
          { value: 14},
          { value: 50},
          { value: 75},
          { value: 110},
        ]}
        step={1}
        value={
          input.find((room) => room?.roomId === items?.room_id)
            ?.block_slider_value || 0
        }
        valueLabelDisplay="on"
        min={0}
        max={110}
        onChange={(e, newValue) => {
          handleChangee(
            { target: { value: newValue } },
            items.room_id,
            "block_slider_value"
          );
        }}
        className="cs-price-slider"
      />
    </div>

    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography
        variant="body2"
        onClick={() => handleChangee({ target: { value: 10 } }, items.room_id, "block_slider_value")}
        sx={{ cursor: "pointer" }}
      >
        NEEDS DAZL
      </Typography>
      <Typography
        variant="body2"
        onClick={() => handleChangee({ target: { value: 60 } }, items.room_id, "block_slider_value")}
        sx={{ cursor: "pointer" }}
      >
        MARKET READY
      </Typography>
      <Typography
        variant="body2"
        onClick={() => handleChangee({ target: { value: 90 } }, items.room_id, "block_slider_value")}
        sx={{ cursor: "pointer" }}
      >
        DAZLING
      </Typography>
      <Typography
        variant="body2"
        onClick={() => handleChangee({ target: { value: 110 } }, items.room_id, "block_slider_value")}
        sx={{ cursor: "pointer" }}
      >
        DAZL PLUS
      </Typography>
    </Box>
  </Box> */}
                {/* previous */}
                {/* <Box sx={{ width: "full", padding: 2 }}>
                  <Slider
                    marks={marks}
                    slots={{
                      valueLabel: ValueLabelComponent,
                    }}
                    step={1}
                    value={
                      input.find((room) => room?.roomId === items?.room_id)
                        ?.block_slider_value || 1
                    }
                    valueLabelDisplay="on"
                    min={1}
                    max={8}
                    onChange={(e) => handleChangee(e, items.room_id, "status")}
                  />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" sx={{ cursor: "pointer" }}>
                      NEEDS DAZL
                    </Typography>
                    <Typography variant="body2" sx={{ cursor: "pointer" }}>
                      MARKET READY
                    </Typography>
                    <Typography variant="body2" sx={{ cursor: "pointer" }}>
                      DAZLING
                    </Typography>
                  </Box>
                </Box> */}
                <RadioGroup
                  aria-label={`${items.room_id}`}
                  name={`${items.room_id}`}
                  value={
                    input.find((room) => room?.roomId === items?.room_id)
                      ?.status || ""
                  }
                  onChange={(e) => onChange(e, items?.room_id, "status")}
                  required
                >
                  <div className="row">
                    <div className="col-md-3 d-flex align-items-center">
                      <FormControlLabel
                        value="NEEDS DAZL"
                        className="me-2"
                        control={
                          <Radio
                          // className={`${errorBorderRadio ? "errorSub" : ""} `}
                          />
                        }
                        label="NEEDS DAZL"
                      />
                      {/* <div className="fst-italic text-danger text-decoration-underline">
                        30% room value
                      </div> */}
                    </div>

                    <div className="col-md-3 d-flex align-items-center">
                      <FormControlLabel
                        value="MARKET READY"
                        className="me-2"
                        control={
                          <Radio
                          // className={`${errorBorderRadio ? "errorSub" : ""} `}
                          />
                        }
                        label="MARKET READY"
                      />
                      {/* <div className="fst-italic text-danger text-decoration-underline">
                        50% room value
                      </div> */}
                    </div>
                    <div className="col-md-3 d-flex align-items-center">
                      <FormControlLabel
                        value="DAZLING"
                        className="me-2"
                        control={
                          <Radio
                          // className={`${errorBorderRadio ? "errorSub" : ""} `}
                          />
                        }
                        label="DAZLING"
                      />
                      {/* <div className="fst-italic text-danger text-decoration-underline">
                        80% room value
                      </div> */}
                    </div>
                    <div className="col-md-3 d-flex align-items-center">
                      <FormControlLabel
                        value="DAZL PLUS"
                        className="me-2"
                        control={<Radio />}
                        label="DAZL PLUS"
                      />
                      {/* <div className="fst-italic text-danger text-decoration-underline">
                        100% room value
                      </div> */}
                    </div>
                  </div>
                </RadioGroup>
              </div>
              <p className="mb-1">Buyer Road Blocks or Recommendations?</p>
              <div className="bg-light rounded-2 py-2 px-3">
                <div className="">
                  {roomData[index]?.data?.data?.map((data, roadBlockIndex) => {
                    if (
                      data.name === "Light Fixtures" ||
                      data.name === "Plumbing Issues (Leaks)"
                    ) {
                      return null;
                    }
                    const displayName =
                      data.name === "Plumbing Fixtures"
                        ? "Plumbing"
                        : data.name;
                    const valueId = data?.id;
                    const matchingRoadBlockIndex = input
                      .find((room) => room?.roomId === items?.room_id)
                      ?.roadBlocks.findIndex(
                        (item) => item?.id === valueId && item?.isChecked
                      );
                    return (
                      <div key={roadBlockIndex} className="form-row">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={input
                                .find((room) => room?.roomId === items?.room_id)
                                ?.roadBlocks.some(
                                  (item) =>
                                    item?.id === valueId && item?.isChecked
                                )}
                              onChange={(e) =>
                                handleValueChange(
                                  items?.room_id,
                                  valueId,
                                  e.target.checked,
                                  "roadBlocks",
                                  index,
                                  matchingRoadBlockIndex,
                                  null
                                )
                              }
                            />
                          }
                          label={`${displayName}`}
                        />

                        {input
                          .find((room) => room.roomId === items.room_id)
                          ?.roadBlocks.some(
                            (item) => item?.id === valueId && item?.isChecked
                          ) && (
                          <>
                            <TextField
                              multiline
                              placeholder="Tell us what you would like to Dazl Up?"
                              rows={4}
                              variant="outlined"
                              fullWidth
                              value={
                                matchingRoadBlockIndex !== -1
                                  ? input.find(
                                      (room) => room.roomId === items?.room_id
                                    )?.roadBlocks[matchingRoadBlockIndex]
                                      ?.roadBlockDescription || ""
                                  : ""
                              }
                              onChange={(e) =>
                                onChangeRoadBlockDescription(
                                  e,
                                  items.room_id,
                                  "roadBlockDescription",
                                  matchingRoadBlockIndex
                                )
                              }
                              error={
                                descriptionError &&
                                matchingRoadBlockIndex !== -1 &&
                                !input.find(
                                  (room) => room.roomId === items?.room_id
                                )?.roadBlocks[matchingRoadBlockIndex]
                                  ?.roadBlockDescription
                              }
                            />
                            <div className="ps-0 mt-3">
                              <div className="d-flex gap-1">
                                {roomImagesObjectCheckbox?.[
                                  index
                                ]?.roadBlocks?.[
                                  matchingRoadBlockIndex
                                ]?.images?.map((image, imageIndex) => (
                                  <div key={imageIndex}>
                                    {image && (
                                      <div className="float-start me-4 position-relative">
                                        <img
                                          alt="img"
                                          src={image}
                                          className="object-fit-cover border"
                                          width={"100px"}
                                          height={"100px"}
                                          onClick={() => {
                                            setSelectedImageUrl(image);
                                            setShowModal(true);
                                          }}
                                          style={{ cursor: "pointer" }}
                                        />

                                        <div className="d-flex justify-content-center dlt-btn-3">
                                          <button
                                            type="button"
                                            className="btn btn-primary btn-sm mt-2 "
                                            onClick={() =>
                                              handleRemoveCheckBoxImage(
                                                roomImagesObjectCheckbox[index]
                                                  .room_id,
                                                matchingRoadBlockIndex,
                                                imageIndex
                                              )
                                            }
                                          >
                                            <DeleteIcon />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}

                                {getRoadBlockImages(roomIdIn, data?.id).map(
                                  (addedImage, addedImageIndex) => (
                                    <div key={addedImageIndex}>
                                      {addedImage && (
                                        <div className="float-start me-4 position-relative">
                                          <img
                                            alt="img"
                                            src={addedImage?.responseImage}
                                            className="object-fit-cover border"
                                            width={"100px"}
                                            height={"100px"}
                                            onClick={() => {
                                              setSelectedImageUrl(
                                                addedImage?.responseImage
                                              );
                                              setShowModal(true);
                                            }}
                                            style={{ cursor: "pointer" }}
                                          />

                                          <div className="d-flex justify-content-center dlt-btn-3">
                                            <button
                                              type="button"
                                              className="btn btn-primary btn-sm mt-2 "
                                              onClick={() =>
                                                // handleRemoveCheckBoxImage(
                                                //   roomImagesObjectCheckbox[
                                                //     index
                                                //   ].room_id,
                                                //   matchingRoadBlockIndex,
                                                //   imageIndex
                                                // )
                                                removeRoadBlockImage(
                                                  roomIdIn,
                                                  data?.id,
                                                  addedImageIndex
                                                )
                                              }
                                            >
                                              <DeleteIcon />
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                            <input
                              id={`upload_room_${roadBlockIndex}`}
                              type="file"
                              className={`form-control`}
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={(e) =>
                                handleImage(
                                  roomIdIn,
                                  "checkbox",
                                  0,
                                  e,
                                  matchingRoadBlockIndex
                                )
                              }
                            />
                            {/* <div className="form-row bg-light rounded-2">
                              <div className="row">
                                {photoFieldsCheckBox?.[index]?.roadBlocks?.[
                                  matchingRoadBlockIndex
                                ]?.images?.map((field, imgIndex) => (
                                  <div className="col-md-6 mt-3" key={imgIndex}>
                                    <div className="d-flex align-items-start gap-2 ">
                                      <input
                                        type="file"
                                        className={`form-control`}
                                        accept="image/*"
                                        onChange={(e) =>
                                          handleImage(
                                            roomIdIn,
                                            "checkbox",
                                            imgIndex,
                                            e,

                                            matchingRoadBlockIndex
                                          )
                                        }
                                      />
                                      {photoFieldsCheckBox?.[index]
                                        ?.roadBlocks?.[matchingRoadBlockIndex]
                                        ?.images?.length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeCheckBoxImages(
                                              index,
                                              imgIndex,
                                              matchingRoadBlockIndex
                                            )
                                          }
                                          className="btn btn-light bg-light-red border-danger space"
                                        >
                                          <DeleteIcon />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div> */}
                            <button
                              type="button"
                              className="btn btn-danger btn btn-primary my-3"
                              onClick={() =>
                                // appendCheckBoxImages(
                                //   index,
                                //   matchingRoadBlockIndex,
                                //   null
                                // )s
                                document
                                  .getElementById(
                                    `upload_room_${roadBlockIndex}`
                                  )
                                  .click()
                              }
                            >
                              Add Photos
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
      <div className="btnsubmit my-3 d-flex justify-content-between">
        <div>
          <button
            type="submit"
            className="btn btn-danger"
            onClick={(e) => save(e, "save")}
          >
            Add another room
          </button>
        </div>
        <button
          className="room btn btn-success m-2"
          onClick={(e) => save(e, "submit")}
        >
          Update
        </button>
      </div>
      {/* Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
        className="custom-modal"
      >
        <Modal.Body className="position-relative">
          <button className="close-button" onClick={() => setShowModal(false)}>
            &times;
          </button>
          <img
            src={selectedImageUrl}
            alt="Modal Image"
            className="modal-image"
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EditPhd;
