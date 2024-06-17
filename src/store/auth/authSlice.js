import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../services/http/baseUrl";
import { Toastify } from "../../services/toastify/toastContainer";

export const agentSignUp = createAsyncThunk(
  "auth/agentSignUp",
  async (data, { dispatch }) => {
    try {
      const response = await http.post("/realtor/register", {
        address: data.streetAddress,
        city: data.city,
        state: data.state,
        zip: data.zip,
        check_box: JSON.parse(data.agreeToTerms),
        confirm_password: data.confirmPassword,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        membershipOption: data.subscription,
        password: data.password,
        phone_number: data.number,
        real_state_agency_name: data.companyName,
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      dispatch(handlecloseLoader(false)),
        Toastify({ data: "error", msg: error.response.data.message });
    }
  }
);

export const professionalSignUp = createAsyncThunk(
  "auth/professionalSignUp",
  async (data, { dispatch }) => {
    try {
      const response = await http.post("/professional/register", {
        check_box: JSON.parse(data.data.agreeToTerms),
        company_city: data.data.city,
        company_name: data.data.companyName,
        company_number: data.data.number,
        company_street_address: data.data.streetAddress,
        confirm_password: data.data.confirmPassword,
        email: data.data.email,
        fb: data.data.facebookLink,
        first_name: data.data.firstName,
        images1: data.images[0],
        images2: data.images[1],
        images3: data.images[2],
        images4: data.images[3],
        insurance: data.data.insuranceCompany,
        insurance_contact_number: data.data.contactPerson,
        insurance_number: data.data.insuranceNumber,
        last_name: data.data.lastName,
        membershipOption: data.data.subscription,
        password: data.data.password,
        phone_number: data.data.mobilenumber,
        services: data.data.selectServices,
        state: data.data.state,
        twitter: data.data.twitterLink,
        website: data.data.websiteLink,
        years: data.data.yearofbusiness,
        zip_code: data.data.zip,
      });

      if (response.status === 201) {
        return response.data;
      }
    } catch (error) {
      dispatch(handlecloseLoader(false)),
        Toastify({ data: "error", msg: error.response.data.message });
    }
  }
);
export const customerSignUp = createAsyncThunk(
  "auth/customerSignUp",
  async (data, { dispatch }) => {
    try {
      const response = await http.post("/customer/register", {
        check_box: JSON.parse(data.agreeToTerms),
        confirm_password: data.confirmPassword,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        password: data.password,
        phone_number: data.number,
        zip_code: data.zipCode,
      });
      if (response.status === 201) {
        return response.data;
      }
    } catch (error) {
      dispatch(handlecloseLoader(false)),
        Toastify({ data: "error", msg: error.response.data.message });
    }
  }
);
export const agentSignin = createAsyncThunk(
  "auth/agentSignin",
  async (data, { dispatch }) => {
    try {
      const response = await http.post("/realtor/login", data);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return (
        dispatch(handlecloseLoader(false)),
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);
export const professionalSignin = createAsyncThunk(
  "auth/professionalSignin",
  async (data, { dispatch }) => {
    try {
      const response = await http.post("/professional/login", data);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return (
        dispatch(handlecloseLoader(false)),
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);
export const customerSignin = createAsyncThunk(
  "auth/customerSignin",
  async (data, { dispatch }) => {
    try {
      const response = await http.post("/customer/login", data);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return (
        // error.response.data,
        dispatch(handlecloseLoader(false)),
        Toastify({ data: "error", msg: error.response.data.message })
      );
    }
  }
);
export const handlecloseLoader = createAsyncThunk(
  "auth/handlecloseLoader",
  async (value) => {
    return value;
  }
);
export const uploadImageAuth = createAsyncThunk(
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
export const contactUsAuth = createAsyncThunk(
  "dashboard/contactUsAuth",
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
const authSlice = createSlice({
  name: "auth",
  initialState: {
    data: {
      agentUser: [],
      professionalUser: [],
      customerUser: [],
      token: null,
    },
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // agent registration
      .addCase(agentSignUp.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(agentSignUp.fulfilled, (state, action) => {
        // state.data.agentUser=action.payload;
        state.loading = false;
      })
      .addCase(agentSignUp.rejected, (state, action) => {
        state.loading = false;
      })
      //    professional registration
      .addCase(professionalSignUp.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(professionalSignUp.fulfilled, (state, action) => {
        // state.data.professionalUser=action.payload;

        state.loading = false;
      })
      .addCase(professionalSignUp.rejected, (state, action) => {
        state.loading = false;
      })

      //agent login
      .addCase(agentSignin.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(agentSignin.fulfilled, (state, action) => {
        localStorage.setItem("userId", action.payload.data.id);
        state.data.token = action.payload.data.token;
        state.data.agentUser = action.payload.data;
        state.loading = false;
      })
      .addCase(agentSignin.rejected, (state, action) => {
        state.loading = false;
      })
      //professional login
      .addCase(professionalSignin.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(professionalSignin.fulfilled, (state, action) => {
        localStorage.setItem("userId", action.payload.data.id);
        state.data.token = action.payload.data.token;
        state.data.professionalUser = action.payload.data;
        state.loading = false;
      })
      .addCase(professionalSignin.rejected, (state, action) => {
        state.loading = false;
      })
      //customerSignin login
      .addCase(customerSignin.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(customerSignin.fulfilled, (state, action) => {
        localStorage.setItem("userId", action.payload.data.id);
        state.data.token = action.payload.data.token;
        state.data.customerUser = action.payload.data;
        state.loading = false;
      })
      .addCase(customerSignin.rejected, (state, action) => {
        state.loading = false;
      })
      //close Loader
      .addCase(handlecloseLoader.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(handlecloseLoader.fulfilled, (state, action) => {
        state.loading = action.payload;
      })
      .addCase(handlecloseLoader.rejected, (state, action) => {
        state.loading = false;
      })
      // upload Image
      .addCase(uploadImageAuth.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(uploadImageAuth.fulfilled, (state, action) => {
        // const imageData=[...state.data.uploadImageAuth,action?.payload.data];
        // state.data.uploadImageAuth=imageData
        state.loading = false;
      })
      .addCase(uploadImageAuth.rejected, (state, action) => {
        state.loading = false;
      })
      // contact us
      .addCase(contactUsAuth.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(contactUsAuth.fulfilled, (state, action) => {
        // const imageData=[...state.data.contactUsAuth,action?.payload.data];
        // state.data.contactUsAuth=imageData
        state.loading = false;
      })
      .addCase(contactUsAuth.rejected, (state, action) => {
        state.loading = false;
      });
  },
});
export default authSlice.reducer;
