import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { HyperContext } from "../Context/context";

const PublicRoute = ({ component: Component, ...rest }) => {
  const { state } = useContext(HyperContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        state.token ? <Redirect to='/library' /> : <Component {...props} />
      }
    />
  );
};

export default PublicRoute;
