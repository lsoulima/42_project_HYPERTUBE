import React, { createContext, useReducer, useEffect, useState } from "react";
import { Initialstate, HyperReducer } from "./reducer";
import { checkTokenAction, logout } from "../services/auth";
import { getUser } from "../services/profile";

export const HyperContext = createContext(Initialstate);

export const HyperProvider = ({ children }) => {
  const [state, dispatch] = useReducer(HyperReducer, Initialstate);
  const [userInfos, setUserInfos] = useState({
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    profile: "",
    fortyTwoId: "",
    githubId: "",
    googleId: "",
  });
  const [lng, setLng] = useState("en");
  const [authorized, setAuthorized] = useState(true);
  useEffect(() => {
    const getUserData = async () => {
      if (state.token) {
        const valideToken = await checkTokenAction(state.token);
        if (valideToken) {
          const userData = await getUser(state.token);
          setUserInfos({
            id: userData._id,
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: userData.email,
            username: userData.username,
            profile: userData.profile,
            fortyTwoId: userData.fortyTwoId,
            githubId: userData.githubId,
            googleId: userData.googleId,
          });
        } else {
          await logout(state.token, dispatch);
          setAuthorized(false);
        }
      }
    };
    getUserData();
  }, [state.token]);

  return (
    <HyperContext.Provider
      value={{
        state,
        dispatch,
        userInfos,
        authorized,
        setUserInfos,
        lng,
        setLng,
      }}>
      {children}
    </HyperContext.Provider>
  );
};
