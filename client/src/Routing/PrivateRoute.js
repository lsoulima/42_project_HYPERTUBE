import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { HyperContext } from "../Context/context";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { state } = useContext(HyperContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        state.token ? <Component {...props} /> : <Redirect to='/login' />
      }
    />
  );
};

export default PrivateRoute;
