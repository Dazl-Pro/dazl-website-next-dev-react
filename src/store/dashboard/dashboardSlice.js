/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../services/http/baseUrl";
import { Toastify } from "../../services/toastify/toastContainer";

export const filterProject = createAsyncThunk(
  "dashboard/filterProject",
  async (data) => {
    try {
      const response = await http.get("/");
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return error.response.data;
    }
  }
);
export const filtersavedProject = createAsyncThunk(
  "dashboard/filtersavedProject",
  async (data) => {
    try {
      const response = await http.get("/");
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return error.response.data;
    }
  }
);
export const getAgentProfiledata = createAsyncThunk(
  "dashboard/getAgentProfiledata",
  async (userId) => {
    try {
      const response = await http.get(`/realtor?+realtor_id=${userId}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return error.response.data;
    }
  }
);
export const updateAgentProfile = createAsyncThunk(
  "dashboard/updateAgentProfile",
  async (values) => {
    try {
      const response = await http.patch(`/realtor/update/`, {
        city_of_real_state_agency: values.city,
        email: values.email,
        first_name: values.firstName,
        last_name: values.lastName,
        phone_number: values.number,
        real_state_agency_name: values.companyName,
        state: values.state,
        zip_code: values.zipCode,
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);
export const updatehomeOwnerProfile = createAsyncThunk(
  "dashboard/updatehomeOwnerProfile",
  async (values, { dispatch }) => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await http.post(`customer/update/${userId}`, {
        id: userId,
        email: values.email,
        first_name: values.firstName,
        last_name: values.lastName,
        phone_number: values.number,
        token: localStorage.getItem("token"),
        type: "customer",
        zip: 10001,
        services: [],
      });
      if (response.status === 200) {
        return response.data, dispatch(customerProfile());
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);
export const changeAgentPassword = createAsyncThunk(
  "dashboard/changeAgentPassword",
  async (values) => {
    try {
      const response = await http.post(`/realtor/change_password`, {
        currentpassword: values.currentPassword,
        password: values.newPassword,
        password_confirmation: values.confirmPassword,
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);
export const changeCustomerPassword = createAsyncThunk(
  "dashboard/changeCustomerPassword",
  async (values) => {
    try {
      const response = await http.post(`/customer/change_password`, {
        currentpassword: values.currentPassword,
        password: values.newPassword,
        password_confirmation: values.confirmPassword,
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);

export const createphdStepone = createAsyncThunk(
  "dashboard/createphdStepone",
  async (values) => {
    try {
      const response = await http.get(
        `/home-diagnostic-reports/house-data?score=100&address=${values.location}&first_name=${values.firstName}&last_name=${values.lastName}&client_email=${values.email}&type=1&year_built=2021&bedrooms=1&bathrooms=1&structure_type=1&lot_size=1&location=${values.location}&foundation_type=1&tax_accessed_value=1&sale_date=1`
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);
export const getCompanyProfile = createAsyncThunk(
  "dashboard/companyProfile",
  async (userId) => {
    try {
      const response = await http.get(
        `/company-from-professional?professional_id=${userId}`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);
export const UpdateCompanyProfile = createAsyncThunk(
  "dashboard/UpdateCompanyProfile",
  async ({ values, images }, { dispatch }) => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await http.post(
        `company-from-professional/update?phone=${values.phoneNumber}&years_in_business=${values.yearofbusiness}&email=${values.email}&insurance_certificate=${values.insuranceCertificate}&insurance_contact_number=${values.insuranceContactNumber}&insurance_number=${values.insuranceNumber}&images1=${images[0]}&images2=${images[1]}&images3=${images[2]}&images4=${images[3]}`
      );
      if (response.status === 200) {
        return (
          response.data,
          dispatch(getCompanyProfile(userId)),
          Toastify({ data: "success", msg: response.data.message })
        );
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);

export const UpdateCompanyProfileSecond = createAsyncThunk(
  "dashboard/UpdateCompanyProfileSecond",
  async (data, { dispatch }) => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await http.post(`professional/update`, data);
      if (response.status === 200) {
        return (
          response.data,
          dispatch(getCompanyProfile(userId)),
          Toastify({ data: "success", msg: response.data.message })
        );
      }
      return await response.json();
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);
export const projectOpportunities = createAsyncThunk(
  "dashboard/projectOpportunities",
  async (values) => {
    try {
      const response = await http.get(
        `/project-opportunities/professionals/all`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);
export const phdRooms = createAsyncThunk(
  "dashboard/phdRooms",
  async (values) => {
    try {
      const response = await http.get(`/roomsfeature/${values}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);

export const diagnosticReports = createAsyncThunk(
  "dashboard/diagnosticReports",
  async (values) => {
    try {
      const response = await http.post(`/home-diagnostic-reports`, {});
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);

export const uploadImage = createAsyncThunk(
  "dashboard/uploadImage",
  async (data) => {
    try {
      const response = await http.post(`/getImage`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);
export const createPhd = createAsyncThunk(
  "dashboard/createPhd",
  async (data) => {
    try {
      const response = await http.post(`/home-diagnostic-reports`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);

export const updatePhd = createAsyncThunk(
  "dashboard/updatePhd",
  async (data) => {
    try {
      const response = await http.post(
        `/update-home-diagnostic-reports/${data.id}`,
        data
        // {
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   },
        // }
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);

export const addRoomFeatures = createAsyncThunk(
  "dashboard/addRoomFeatures",
  async (data, { dispatch }) => {
    try {
      const response = await http.post(`/${data.payload}`, {
        data: data.selectedImages ?? data.data,
        name: data.name,
        projectID: data.projectID,
      });
      if (response.status === 200) {
        if (data.payload === "realtorprojects") {
          dispatch(getAgentProject({ pageNo: 1, numberofdata: 5 }));
        } else {
          dispatch(getCustomerProject({ pageNo: 1, numberofdata: 5 }));
        }
        return response.data;
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);
export const addAnotherRoom = createAsyncThunk(
  "dashboard/addAnotherRoom",
  async (data) => {
    try {
      return data;
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: "Something went wrong" })
      );
    }
  }
);
export const getCustomerProject = createAsyncThunk(
  "dashboard/getCustomerProject",
  async (data) => {
    try {
      const response = await http.get(
        `/projects/customers/${data.pageNo}/${data.numberofdata}`
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);

export const getAgentProject = createAsyncThunk(
  "dashboard/getAgentProject",
  async (data) => {
    try {
      const response = await http.get(
        `/realtorprojects/customers/${data.pageNo}/${data.numberofdata}`
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);

export const contactUsDash = createAsyncThunk(
  "dashboard/contactUsDash",
  async (data) => {
    try {
      const response = await http.post(`/contact-us`, data);
      if (response.status === 200) {
        return (
          response.data,
          Toastify({ data: "success", msg: response.data.message })
        );
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);
export const customerProfile = createAsyncThunk(
  "dashboard/customerProfile",
  async (data) => {
    try {
      const response = await http.get(`/customer/profile`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);

export const updateReportFeatures = createAsyncThunk(
  "dashboard/updateReportFeatures",
  async ({ data, project_id, pageNo, numberofdata }, { dispatch }) => {
    try {
      const response = await http.patch(
        `/update-phpreport/${project_id}`,
        data
      );
      if (response.status === 200) {
        dispatch(
          getCustomerProject({ pageNo: pageNo, numberofdata: numberofdata })
        );
        return response.data;
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);

export const updateAgentFeatures = createAsyncThunk(
  "dashboard/updateAgentFeatures",
  async ({ data, project_id, pageNo, project, numberofdata }, { dispatch }) => {
    try {
      const response = await http.patch(`/update-report/${project_id}`, data);
      if (response.status === 200) {
        dispatch(
          getAgentProject({
            pageNo: pageNo,
            numberofdata: numberofdata,
            project: project,
          })
        );
        return response.data;
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);

export const deleteProjectFeatures = createAsyncThunk(
  "dashboard/deleteProjectFeatures",
  async (
    { projectId, housingSegmentId, pageNo, numberofdata },
    { dispatch }
  ) => {
    try {
      const response = await http.delete(`/delete-report/${projectId}`);
      if (response.status === 200) {
        dispatch(getCustomerProject({ pageNo, numberofdata }));
        return response.data;
      }
    } catch (error) {
      Toastify({ data: "error", msg: error.response.data.message });
      return error.response.data;
    }
  }
);

export const deleteAgentFeatures = createAsyncThunk(
  "dashboard/deleteAgentFeatures",
  async ({ projectId, pageNo, numberofdata }, { dispatch }) => {
    try {
      const response = await http.delete(`/realtor/project/${projectId}`);
      if (response.status === 200) {
        dispatch(
          getAgentProject({ pageNo: pageNo, numberofdata: numberofdata })
        );
        return response.data;
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);
export const deleteProfessionalProjects = createAsyncThunk(
  "dashboard/deleteProfessionalProjects",
  async ({ project_id }, { dispatch }) => {
    try {
      const response = await http.delete(`/professional/project/${project_id}`);
      if (response.status === 200) {
        // dispatch(
        //   getAgentProject({ pageNo: pageNo, numberofdata: numberofdata })
        // );
        //   // Navigate(/company/projectOpportunities)
        //
      }
      console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%", response);
      return response.data;
    } catch (error) {
      console.error("error", error);
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);
export const getCompletePhd = createAsyncThunk(
  "dashboard/getCompletePhd",
  async () => {
    try {
      const response = await http.get(`/filter_project`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return error.response.data;
      // Toastify({ data: "error", msg: error.response.data.message })
    }
  }
);

export const getSavedPhd = createAsyncThunk(
  "dashboard/getSavedPhd",
  async () => {
    try {
      const response = await http.get(`/filter_savedproject`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return error.response.data;
      // Toastify({ data: "error", msg: error.response.data.message })
    }
  }
);
export const viewPhd = createAsyncThunk(
  "dashboard/viewPhd",
  async (value, { dispatch }) => {
    try {
      const response = await http.get(
        `/home-diagnostic-reports-test/for-realtor/${value.id}`
      );

      if (response.status === 200) {
        if (value.value === "saveclose") {
          dispatch(updateProjectStatus(response.data.reports[0].project_id));
        }
        return { response: response.data, value: value.value };
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);

export const viewPhdAlt = createAsyncThunk(
  "dashboard/viewPhdAlt",
  async (value, { dispatch }) => {
    try {
      const response = await http.get(
        `/home-diagnostic-reports-test/for-realtor/${value.id}`
      );

      if (response.status === 200) {
        if (value.value === "saveclose") {
          dispatch(updateProjectStatus(response.data.reports[0].project_id));
        }
        return { response: response.data, value: value.value };
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);

export const viewServicePhd = createAsyncThunk(
  "dashboard/viewServicePhd",
  async (value) => {
    try {
      const response = await http.get(
        `/project-opportunities/project/${value}`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return error.response.data;
      // Toastify({ data: "error", msg: error.response.data.message })
    }
  }
);

export const sendMailHomeOwner = createAsyncThunk(
  "dashboard/sendMailHomeOwner",
  async (value) => {
    try {
      const response = await http.post(`/sendtestnote`, value);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return error.response.data;
      // Toastify({ data: "error", msg: error.response.data.message })
    }
  }
);

export const deletePhd = createAsyncThunk(
  "dashboard/deletePhd",
  async (value, { dispatch }) => {
    try {
      const response = await http.delete(`/realtor/project/${value}`);

      if (response.status === 200) {
        dispatch(getCompletePhd());
        dispatch(openConfirmPopup(false));
        return response.data;
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);

export const mailPdf = createAsyncThunk(
  "dashboard/mailPdf",
  async ({ firstName, lastName, email, pdfData }, { dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);

      formData.append("email", email);
      formData.append("pdfData", pdfData);

      const response = await http.post(`/sendtestmail`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);

export const updateProjectStatus = createAsyncThunk(
  "dashboard/updateProjectStatus",
  async (value, { dispatch }) => {
    try {
      const response = await http.get(`/update_project_status/${value}`);

      if (response.status === 200) {
        dispatch(getCompletePhd());
        // dispatch(openConfirmPopup(false));
        return response.data;
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);
export const bidStatusUpdate = createAsyncThunk(
  "dashboard/bidStatusUpdate",
  async (value) => {
    const { id, status, room, feature_id } = value;
    try {
      const response = await http.patch(
        `/statusUpdate/${id}?&room_id=${room}&bid_status=${status}&feature_id=${feature_id}`
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return (
        error.response.data,
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);

export const closeViewPhd = createAsyncThunk(
  "dashboard/closeViewPhd",
  async (value) => {
    try {
      return value;
    } catch (error) {}
  }
);

export const closeViewPhdAlt = createAsyncThunk(
  "dashboard/closeViewPhdAlt",
  async (value) => {
    try {
      return value;
    } catch (error) {}
  }
);

export const openConfirmPopup = createAsyncThunk(
  "dashboard/openConfirmPopup",
  async (value) => {
    try {
      return value;
    } catch (error) {}
  }
);
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    data: {
      completePhd: [],
      savedPhd: [],
      agentData: [],
      phdStepOne: null,
      companydata: [],
      projectOpportunities: null,
      phdRoomsData: [],
      diagnosticReports: null,
      uploadImage: [],
      roomtype: null,
      sendMailHomeOwner: null,
      customerprojectData: [],
      agentProjectData: [],
      customerData: [],
      viewPhdAlt: null,
      show: false,
      showAlt: false,
      viewPhd: [],
      confirmPopup: false,
      addValueData: [],
      price: "",
      addAnotherRoom: [],
      viewServicePhd: null,
    },
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(filterProject.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(filterProject.fulfilled, (state, action) => {
        state.loading = false;
        state.data.completePhd = action.payload;
      })
      .addCase(filterProject.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(filtersavedProject.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(filtersavedProject.fulfilled, (state, action) => {
        state.loading = false;
        state.data.savedPhd = action.payload;
      })

      .addCase(filtersavedProject.rejected, (state, action) => {
        state.loading = false;
      })
      // get agent profile data
      .addCase(getAgentProfiledata.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAgentProfiledata.fulfilled, (state, action) => {
        state.loading = false;
        state.data.agentData = action.payload;
      })
      .addCase(getAgentProfiledata.rejected, (state, action) => {
        state.loading = false;
      })
      // add another room
      .addCase(addAnotherRoom.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addAnotherRoom.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Payload", action.payload);
        const value = [...state.data.addAnotherRoom, action.payload];
        localStorage.setItem("projectItem", JSON.stringify(value));
        state.data.addAnotherRoom = value;
      })
      .addCase(addAnotherRoom.rejected, (state, action) => {
        state.loading = false;
      })
      //get company professional profile data
      .addCase(getCompanyProfile.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data.companydata = action.payload;
      })
      .addCase(getCompanyProfile.rejected, (state, action) => {
        state.loading = false;
      })
      //update agent Profile
      .addCase(updateAgentProfile.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateAgentProfile.fulfilled, (state, action) => {
        if (action.payload.status === 200) {
          Toastify({ data: "success", msg: action.payload.message });
          state.data.agentData = [];
        }
        state.loading = false;
      })
      .addCase(updateAgentProfile.rejected, (state, action) => {
        state.loading = false;
      })
      //update home owner profile
      .addCase(updatehomeOwnerProfile.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updatehomeOwnerProfile.fulfilled, (state, action) => {
        if (action.payload.status === 200) {
          Toastify({ data: "success", msg: action.payload.message });
          state.data.agentData = [];
        }
        state.loading = false;
      })
      .addCase(updatehomeOwnerProfile.rejected, (state, action) => {
        state.loading = false;
      })
      //update company profile
      .addCase(UpdateCompanyProfile.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(UpdateCompanyProfile.fulfilled, (state, action) => {
        if (action.payload.status === 200) {
          Toastify({ data: "success", msg: action.payload.message });
          state.data.agentData = [];
        }
        state.loading = false;
      })
      .addCase(UpdateCompanyProfile.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(UpdateCompanyProfileSecond.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(UpdateCompanyProfileSecond.fulfilled, (state, action) => {
        if (action.payload.status === 200) {
          Toastify({ data: "success", msg: action.payload.message });
          state.data.agentData = [];
        }
        state.loading = false;
      })
      .addCase(UpdateCompanyProfileSecond.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //update agent Passwprd
      .addCase(changeAgentPassword.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(changeAgentPassword.fulfilled, (state, action) => {
        if (action.payload.status === 200) {
          Toastify({ data: "success", msg: action.payload.message });
        }
        state.loading = false;
      })
      .addCase(changeAgentPassword.rejected, (state, action) => {
        state.loading = false;
      })
      //update  changeCustomerPassword
      .addCase(changeCustomerPassword.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(changeCustomerPassword.fulfilled, (state, action) => {
        if (action.payload.status === 200) {
          Toastify({ data: "success", msg: action.payload.message });
        }
        state.loading = false;
      })
      .addCase(changeCustomerPassword.rejected, (state, action) => {
        state.loading = false;
      })
      // create phd first step
      .addCase(createphdStepone.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createphdStepone.fulfilled, (state, action) => {
        localStorage.setItem("phdValue", JSON.stringify(action.payload));
        state.data.phdStepOne = action.payload;
        state.loading = false;
      })
      .addCase(createphdStepone.rejected, (state, action) => {
        state.loading = false;
      })
      //get project opportunities
      .addCase(projectOpportunities.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(projectOpportunities.fulfilled, (state, action) => {
        state.data.projectOpportunities = action.payload.data;
        state.loading = false;
      })
      .addCase(projectOpportunities.rejected, (state, action) => {
        state.loading = false;
      })
      //phd Room
      .addCase(phdRooms.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(phdRooms.fulfilled, (state, action) => {
        state.data.phdRoomsData = action.payload.data;
        state.data.roomtype = action.payload.roomtype;
        state.data.addValueData = action.payload.addValueData;
        state.data.price = action.payload.price;
        state.loading = false;
      })
      .addCase(phdRooms.rejected, (state, action) => {
        state.loading = false;
      })

      // diagnosticReports
      .addCase(diagnosticReports.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(diagnosticReports.fulfilled, (state, action) => {
        state.data.diagnosticReports = action.payload.data;
        state.loading = false;
      })
      .addCase(diagnosticReports.rejected, (state, action) => {
        state.loading = false;
      })
      // upload Image
      .addCase(uploadImage.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
      })
      // create PHD
      .addCase(createPhd.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createPhd.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createPhd.rejected, (state, action) => {
        state.loading = false;
      })
      // addRoomFeatures
      .addCase(addRoomFeatures.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addRoomFeatures.fulfilled, (state, action) => {
        state.data.addAnotherRoom = [];
        state.loading = false;
      })
      .addCase(addRoomFeatures.rejected, (state, action) => {
        state.loading = false;
      })
      // get customer project data
      .addCase(getCustomerProject.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCustomerProject.fulfilled, (state, action) => {
        state.data.customerprojectData = action.payload.data;
        state.loading = false;
      })
      .addCase(getCustomerProject.rejected, (state, action) => {
        state.loading = false;
      })

      // get customer project data
      .addCase(getAgentProject.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAgentProject.fulfilled, (state, action) => {
        state.data.agentProjectData = action.payload.data;
        state.loading = false;
      })
      .addCase(getAgentProject.rejected, (state, action) => {
        state.loading = false;
      })
      // contact us
      .addCase(contactUsDash.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(contactUsDash.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(contactUsDash.rejected, (state, action) => {
        state.loading = false;
      })
      // customer profile
      .addCase(customerProfile.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(customerProfile.fulfilled, (state, action) => {
        state.data.customerData = action.payload.customer;
        state.loading = false;
      })
      .addCase(customerProfile.rejected, (state, action) => {
        state.loading = false;
      })
      // get complete Phd
      .addCase(getCompletePhd.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCompletePhd.fulfilled, (state, action) => {
        state.data.completePhd = action.payload;
        state.loading = false;
      })
      .addCase(getCompletePhd.rejected, (state, action) => {
        state.loading = false;
      })
      // get saved Phd
      .addCase(getSavedPhd.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getSavedPhd.fulfilled, (state, action) => {
        state.data.savedPhd = action.payload;
        state.loading = false;
      })
      .addCase(getSavedPhd.rejected, (state, action) => {
        state.loading = false;
      })
      // view Phd
      .addCase(viewPhd.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(viewPhd.fulfilled, (state, action) => {
        state.data.viewPhd = action.payload.response.reports;
        if (action.payload.value === "open") {
          state.data.show = true;
        }
        state.loading = false;
      })
      .addCase(viewPhd.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(viewPhdAlt.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(viewPhdAlt.fulfilled, (state, action) => {
        state.data.viewPhdAlt = action.payload.response.reports;
        if (action.payload.value === "open") {
          state.data.showAlt = true;
        }
        state.loading = false;
      })
      .addCase(viewPhdAlt.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(viewServicePhd.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(viewServicePhd.fulfilled, (state, action) => {
        state.data.viewServicePhd = action.payload;
        if (action.payload.value === "open") {
          state.data.showAlt = true;
        }
        state.loading = false;
      })
      .addCase(viewServicePhd.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(sendMailHomeOwner.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(sendMailHomeOwner.fulfilled, (state, action) => {
        state.data.sendMailHomeOwner = action.payload;
        if (action.payload.value === "open") {
          state.data.showAlt = true;
        }
        state.loading = false;
      })
      .addCase(sendMailHomeOwner.rejected, (state, action) => {
        state.loading = false;
      })
      //  close view phd
      .addCase(closeViewPhd.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(closeViewPhd.fulfilled, (state, action) => {
        state.data.show = action.payload;
        state.loading = false;
      })
      .addCase(closeViewPhd.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(closeViewPhdAlt.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(closeViewPhdAlt.fulfilled, (state, action) => {
        state.data.showAlt = action.payload;
        state.loading = false;
      })
      .addCase(closeViewPhdAlt.rejected, (state, action) => {
        state.loading = false;
      })
      //  bidStatusUpdate
      .addCase(bidStatusUpdate.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(bidStatusUpdate.fulfilled, (state, action) => {
        Toastify({
          data: "success",
          msg: "YOUR BID STATUS SAVED SUCCESSFULLY",
        });
        state.loading = false;
      })
      .addCase(bidStatusUpdate.rejected, (state, action) => {
        state.loading = false;
      })
      //  bidStatusUpdate
      .addCase(openConfirmPopup.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(openConfirmPopup.fulfilled, (state, action) => {
        state.data.confirmPopup = action.payload;
        state.loading = false;
      })
      .addCase(openConfirmPopup.rejected, (state, action) => {
        state.loading = false;
      })
      //  delete Phd
      .addCase(deletePhd.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deletePhd.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deletePhd.rejected, (state, action) => {
        state.loading = false;
      })
      //  update save Project  Phd
      .addCase(updateProjectStatus.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateProjectStatus.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateProjectStatus.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export default dashboardSlice.reducer;
