import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from "./actionsTypes";
import Cookie from "js-cookie";

//* Get token from localStorage or Cookie and set it in token

const token = localStorage.getItem("token") || Cookie.get("token");

export const Initialstate = {
  success: false,
  token: token,
};

//* Hyper Reducer

export const HyperReducer = (state = Initialstate, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: payload.token,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        token: payload.token,
      };
    case LOGOUT:
      return {
        ...state,
        token: "",
      };
    default:
      return {};
  }
};
