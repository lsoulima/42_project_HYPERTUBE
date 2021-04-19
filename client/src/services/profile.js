import axios from "axios";

const API_URL = "http://localhost:3001/api/users/";

//* Get User data

export const getUser = async (token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await axios.get(API_URL + "profile", config);
    if (res.data) return res.data.data;
  } catch (error) {
    return false;
  }
};

//* Get Other user data by Username

export const findProfileByUsername = async (token, username) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await axios.get(API_URL + "find/username/" + username, config);

    if (res.data) return res.data.data;
  } catch (error) {
    return error.response.data;
  }
};

//* Put New Profile Image

export const ProfileUpAction = async (token, file) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  let formData = new FormData();

  formData.append("profile", file);
  try {
    const res = await axios.put(API_URL + "upload/profile", formData, config);

    if (res.data) return res.data;
  } catch (error) {
    return error.response?.data;
  }
};

//* Patch Settings data
export const settingsAction = async (token, data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await axios.patch(API_URL + "edit/informations", data, config);

    if (res.data) return res.data;
  } catch (error) {
    return error.response.data;
  }
};

//* Update password Action

export const changePassword = async (token, editpassword) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await axios.patch(
      API_URL + "edit/password",
      editpassword,
      config
    );

    if (res) return res.data;
  } catch (error) {
    return error.response?.data;
  }
};
